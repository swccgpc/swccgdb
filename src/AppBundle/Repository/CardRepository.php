<?php 

namespace AppBundle\Repository;

use AppBundle\Entity\Card;
use Doctrine\ORM\EntityRepository;

class CardRepository extends EntityRepository
{
    public function findAll()
    {
        $qb = $this->createQueryBuilder('c')
            ->select('c, t, f, p, y')
            ->join('c.type', 't')
            ->join('c.side', 'f')
            ->join('c.set', 'p')
            ->join('p.cycle', 'y')
            ->orderBY('c.code', 'ASC');

        return $qb->getQuery()->getResult();
    }

    public function findByType($type)
    {
        $qb = $this->createQueryBuilder('c')
            ->select('c, p')
            ->join('c.set', 'p')
            ->join('c.type', 't')
            ->andWhere('t.code = ?1')
            ->orderBY('c.code', 'ASC');

        $qb->setParameter(1, $type);

        return $qb->getQuery()->getResult();
    }

    ##
    ## Find my code matches the /card/XXXXXX url
    ##
    public function findByCode($code)
    {
        $qb = $this->createQueryBuilder('c')
            ->select('c')
            ->andWhere('c.code = ?1');

        $qb->setParameter(1, $code);

        $results = $qb->getQuery()->getOneOrNullResult();
        #print("DPH <b>getQuery->getOneOrNullResult</b>:<pre>");
        #var_dump($results);
        #print("</pre>");
        return $results;
    }

    public function findAllByCodes($codes)
    {
        $qb = $this->createQueryBuilder('c')
            ->select('c, t, f, p, y')
            ->join('c.type', 't')
            ->join('c.side', 'f')
            ->join('c.set', 'p')
            ->join('p.cycle', 'y')
            ->andWhere('c.code in (?1)')
            ->orderBY('c.code', 'ASC');

        $qb->setParameter(1, $codes);

        return $qb->getQuery()->getResult();
    }

    public function findByRelativePosition(Card $card, int $position)
    {
        $qb = $this->createQueryBuilder('c')
            ->select('c')
            ->join('c.set', 'p')
            ->andWhere('p.code = ?1')
            ->andWhere('c.position = ?2');

        $qb->setParameter(1, $card->getSet()->getCode());
        $qb->setParameter(2, $card->getPosition()+$position);

        return $qb->getQuery()->getOneOrNullResult();
    }

    public function findPreviousCard($card)
    {
        return $this->findByRelativePosition($card, -1);
    }

    public function findNextCard($card)
    {
        return $this->findByRelativePosition($card, 1);
    }

    public function findTraits()
    {
        $qb = $this->createQueryBuilder('c')
            ->select('DISTINCT c.traits')
            ->andWhere("c.traits != ''");
        return $qb->getQuery()->getResult();
    }
}
