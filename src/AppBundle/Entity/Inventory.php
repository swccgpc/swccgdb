<?php

namespace AppBundle\Entity;

/**
 * Inventory
 */
class Inventory
{
  /**
   * @var int
   */
  private $id;

  /**
   * @var \Doctrine\Common\Collections\Collection
   */
  private $slots;

  /**
   * @var \AppBundle\Entity\User
   */
  private $user;

  /**
   * Constructor
   */
  public function __construct()
  {
    $this->slots = new \Doctrine\Common\Collections\ArrayCollection();
  }

  /**
   * Get id.
   *
   * @return int
   */
  public function getId()
  {
    return $this->id;
  }

  /**
   * Add slot
   *
   * @param \AppBundle\Entity\InventorySlot $slot
   *
   * @return Deck
   */
  public function addSlot(\AppBundle\Entity\InventorySlot $slot)
  {
    $this->slots[] = $slot;

    return $this;
  }

  /**
   * Remove slot
   *
   * @param \AppBundle\Entity\InventorySlot $slot
   */
  public function removeSlot(\AppBundle\Entity\InventorySlot $slot)
  {
    $this->slots->removeElement($slot);
  }

  /**
   * Get slots
   *
   * @return \Doctrine\Common\Collections\ArrayCollection
   */
  public function getSlots()
  {
    return $this->slots;
  }

  /**
   * Get Quantities keyed by Card Code
   *
   * @return array
   */
  public function getCardQuantities() {
    $slots = $this->slots->toArray();
    $cards = array_reduce($slots, function ($cards, $slot) {
      $cards[$slot->getCard()->getCode()] = $slot->getQuantity();
      return $cards;
    }, []);
    return $cards;
  }

  /**
   * Set user
   *
   * @param \AppBundle\Entity\User $user
   *
   * @return Deck
   */
  public function setUser(\AppBundle\Entity\User $user = null)
  {
    $this->user = $user;

    return $this;
  }

  /**
   * Get user
   *
   * @return \AppBundle\Entity\User
   */
  public function getUser()
  {
    return $this->user;
  }
}
