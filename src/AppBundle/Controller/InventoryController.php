<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;

use AppBundle\Entity\Inventory;
use AppBundle\Entity\InventorySlot;

class InventoryController extends Controller
{
  public function viewAction()
  {
    $user = $this->getUser();
    if (!$user) {
      throw $this->createAccessDeniedException("Anonymous access denied");
    }

    $inventory = $user->getInventory();
    // If the user is visiting their inventory for the first time, go
    // ahead and create a new one.
    if (!$inventory) {
      $entityManager = $this->getDoctrine()->getManager();
      $inventory = new Inventory();
      $inventory->setUser($user);
      $entityManager->persist($inventory);
      $entityManager->flush();
    }

    return $this->render(
      'AppBundle:Inventory:inventory.html.twig',
      [
        'pagetitle' => "Inventory",
        'inventory' => $inventory,
      ]
    );
  }

  public function getCardQuantitiesAction() {
    $cardQuantities = $this->getUser()->getInventory()->getCardQuantities();
    $response = new Response();
    $response->headers->set('Content-Type', 'application/json');
    $content = json_encode($cardQuantities);
    $response->setContent($content);
    return $response;
  }

  public function addCardAction($card_code)
  {
    $user = $this->getUser();
    if (!$user) {
      throw $this->createAccessDeniedException("Anonymous access denied");
    }
    $card = $this->getDoctrine()->getRepository('AppBundle:Card')->findOneByCode($card_code);
    if ($card === null) {
      throw $this->createNotFoundException("This card does not exist");
    }
    $entityManager = $this->getDoctrine()->getManager();
    $inventory = $user->getInventory();
    $slot = $this->getDoctrine()->getRepository('AppBundle:InventorySlot')->findOneBy([
      'inventory' => $inventory,
      'card' => $card,
    ]);
    if ($slot === null) {
      $slot = new InventorySlot();
      $slot->setInventory($inventory);
      $slot->setCard($card);
    }
    $slot->incrementQuantity();
    $entityManager->persist($slot);
    $entityManager->flush();
    return new Response("Inventory card incremented");
  }

  public function removeCardAction($card_code)
  {
    $user = $this->getUser();
    if (!$user) {
      throw $this->createAccessDeniedException("Anonymous access denied");
    }
    $card = $this->getDoctrine()->getRepository('AppBundle:Card')->findOneByCode($card_code);
    if ($card === null) {
      throw $this->createNotFoundException("This card does not exist");
    }
    $entityManager = $this->getDoctrine()->getManager();
    $inventory = $user->getInventory();
    $slot = $this->getDoctrine()->getRepository('AppBundle:InventorySlot')->findOneBy([
      'inventory' => $inventory,
      'card' => $card,
    ]);
    if ($slot !== null) {
      $slot->decrementQuantity();
      $quantity = $slot->getQuantity();
      if ($quantity > 0) {
        $entityManager->persist($slot);
      } else {
        $entityManager->remove($slot);
      }
      $entityManager->flush();
    }
    return new Response("Inventory card decremented");
  }

  public function importAction(Request $request)
  {
    $response = new Response();
    $response->headers->set('Content-Type', 'application/json');
    $file = $request->files->get('file');
    $handle = fopen($file->getPathname(), "r");
    if ($handle === FALSE) {
      $response->setContent("Failed to parse uploaded CSV.");
      $response->setStatusCode(Response::HTTP_INTERNAL_SERVER_ERROR);
      return $response;
    }
    $inventory = $this->getUser()->getInventory();
    $i = 0;
    $codeKey = null;
    $qtyKey = null;
    while (($row = fgetcsv($handle)) !== FALSE) {
      if ($i === 0) {
        foreach ($row as $key => $column) {
          $column = preg_replace('/\PL/u', '', strtolower($column));
          if ($column == 'code') {
            $codeKey = $key;
          } else if ($column == 'qty') {
            $qtyKey = $key;
          }
        }
        if ($codeKey === null || $qtyKey === null) {
          $response->setContent('"code" and "qty" columns are required.');
          $response->setStatusCode(Response::HTTP_INTERNAL_SERVER_ERROR);
          return $response;
        }
        $i++;
        continue;
      }
      $i++;
      $code = $row[$codeKey];
      $qty = $row[$qtyKey];
      $card = $this->getDoctrine()->getRepository('AppBundle:Card')->findOneByCode($code);
      if ($card === null) {
        $response->setContent("Card with code {$code} does not exist.");
        $response->setStatusCode(Response::HTTP_INTERNAL_SERVER_ERROR);
        return $response;
      }
      $entityManager = $this->getDoctrine()->getManager();
      $slot = $this->getDoctrine()->getRepository('AppBundle:InventorySlot')->findOneBy([
        'inventory' => $inventory,
        'card' => $card,
      ]);
      // Don't create a new inventory slot if there's not one already and the
      // quantity is 0. If there is a slot, delete it.
      if ($qty == 0 || $qty == '') {
        if ($slot !== null) {
          $entityManager->remove($slot);
          $entityManager->flush();
        }
        continue;
      }
      if ($slot === null) {
        $slot = new InventorySlot();
        $slot->setInventory($inventory);
        $slot->setCard($card);
      }
      $slot->setQuantity($qty);
      $entityManager->persist($slot);
      $entityManager->flush();
    }
    fclose($handle);
    return $response;
  }
}
