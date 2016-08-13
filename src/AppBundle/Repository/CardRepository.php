<?php 

namespace AppBundle\Repository;

class CardRepository extends TranslatableRepository
{
	function __construct($entityManager)
	{
		parent::__construct($entityManager, $entityManager->getClassMetadata('AppBundle\Entity\Card'));
	}
}
