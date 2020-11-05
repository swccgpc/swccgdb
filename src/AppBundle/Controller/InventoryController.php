<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Doctrine\ORM\EntityManagerInterface;

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
      'inventory' => $user,
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
      'inventory' => $user,
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
}
