<?php

namespace AppBundle\Services;

/**
 * Description of DeckImportService
 *
 * @author cedric
 */
class DeckImportService
{

    /**
     *
     * @var \Doctrine\ORM\EntityManager
     */
    public $em;

    public function __construct(\Doctrine\ORM\EntityManager $em)
    {
        $this->em = $em;
    }

    public function parseTextImport($text)
    {
        $data = [
            'content' => [],
            'side' => null,
            'description' => ''
        ];

        $lines = explode("\n", $text);

        foreach ($lines as $line) {
            if (substr($line, 0, 6) === 'Side: ') {
              $sideName = str_replace('Side: ', '', $line);
              $side = $this->em->getRepository('AppBundle:Side')->findOneByName(trim($sideName));
              if (!$side) {
                throw new \Exception("Card import must have a side defined as 'Side: sidename'");
              }
              $data['side'] = $side;
              continue;
            }
            $matches = [];
            $setName = null;
            if (preg_match('/^\s*(\d+)x?([\pLl\pLu\pN\-\.\'\!\:\,\&( \(*\))?]+)\[?([a-zA-Z0-9_ ]+)?\]?/', $line, $matches)) {
                $quantity = intval($matches[1]);
                $name = trim($matches[2]);
                $setName = array_key_exists(3, $matches) ? trim($matches[3]) : null;
            } elseif (preg_match('/^([^\(]+).*x(\d)/', $line, $matches)) {
                $quantity = intval($matches[2]);
                $name = trim($matches[1]);
            } elseif (preg_match('/^([^\(]+)/', $line, $matches)) {
                $quantity = 1;
                $name = trim($matches[1]);
            } else {
                continue;
            }
            $params = [
              'name' => $name,
              'side' => $data['side'],
            ];
            if ($setName !== null) {
              $params['set'] = $this->em->getRepository('AppBundle:Set')->findOneBy(['name' => $setName]);
            }
            $card = $this->em->getRepository('AppBundle:Card')->findOneBy($params);
            if ($card) {
              $data['content'][$card->getCode()] = $quantity;
            }
        }

        return $data;
    }

    public function parseOctgnImport($octgn)
    {
        $data = [
            'content' => [],
            'side' => null,
            'description' => ''
        ];

        $crawler = new \Symfony\Component\DomCrawler\Crawler();
        $crawler->addXmlContent($octgn);

        // read octgnId
        $cardcrawler = $crawler->filter('deck > section > card');
        $octgnIds = [];
        foreach ($cardcrawler as $domElement) {
            $octgnIds[$domElement->getAttribute('id')] = intval($domElement->getAttribute('qty'));
        }

        // read desc
        $desccrawler = $crawler->filter('deck > notes');
        $descriptions = [];
        foreach ($desccrawler as $domElement) {
            $descriptions[] = $domElement->nodeValue;
        }
        $data['description'] = implode("\n", $descriptions);

        foreach ($octgnIds as $octgnId => $qty) {
            $card = $this->em->getRepository('AppBundle:Card')->findOneBy(array(
                'octgnId' => $octgnId
            ));
            if ($card) {
                $data['content'][$card->getCode()] = $qty;
            } else {
                $side = $this->em->getRepository('AppBundle:Side')->findOneBy(array(
                    'octgnId' => $octgnId
                ));
                if ($side) {
                    $data['side'] = $side;
                }
            }
        }

        return $data;
    }
}
