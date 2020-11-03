<?php

namespace AppBundle\Entity;

/**
 * InventorySlot
 */
class InventorySlot
{
    /**
     * @var int
     */
    private $id;

    /**
     * @var \AppBundle\Entity\Inventory
     */
    private $inventory;

    /**
     * @var \AppBundle\Entity\Card
     */
    private $card;

    /**
     * @var int
     */
    private $quantity = 0;

    /**
     * @var \DateTime
     */
    private $dateUpdate;

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
     * Set quantity.
     *
     * @param int $quantity
     *
     * @return InventorySlot
     */
    public function setQuantity($quantity)
    {
        $this->quantity = $quantity;

        return $this;
    }

    /**
     * Increment quantity.
     *
     * @param int $quantity
     *
     * @return InventorySlot
     */
    public function incrementQuantity()
    {
        $this->quantity++;

        return $this;
    }

    /**
     * Increment quantity.
     *
     * @param int $quantity
     *
     * @return InventorySlot
     */
    public function decrementQuantity()
    {
        if ($this->quantity > 0) {
          $this->quantity--;
        }

        return $this;
    }

    /**
     * Get quantity.
     *
     * @return int
     */
    public function getQuantity()
    {
        return $this->quantity;
    }

    /**
     * Set inventory
     *
     * @param \AppBundle\Entity\Inventory $inventory
     *
     * @return Inventoryslot
     */
    public function setInventory(\AppBundle\Entity\Inventory $inventory = null)
    {
        $this->inventory = $inventory;

        return $this;
    }

    /**
     * Get inventory
     *
     * @return \AppBundle\Entity\Inventory
     */
    public function getInventory()
    {
        return $this->inventory;
    }

    /**
     * Set card
     *
     * @param \AppBundle\Entity\Card $card
     *
     * @return Inventoryslot
     */
    public function setCard(\AppBundle\Entity\Card $card = null)
    {
        $this->card = $card;

        return $this;
    }

    /**
     * Get card
     *
     * @return \AppBundle\Entity\Card
     */
    public function getCard()
    {
        return $this->card;
    }

    /**
     * Set dateUpdate
     *
     * @param \DateTime $dateUpdate
     *
     * @return Card
     */
    public function setDateUpdate($dateUpdate)
    {
        $this->dateUpdate = $dateUpdate;

        return $this;
    }

    /**
     * Get dateUpdate
     *
     * @return \DateTime
     */
    public function getDateUpdate()
    {
        return $this->dateUpdate;
    }
}
