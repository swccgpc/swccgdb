<?php

namespace AppBundle\Services;

use AppBundle\Entity\Card;
use Doctrine\Bundle\DoctrineBundle\Registry;
use Symfony\Bundle\FrameworkBundle\Routing\Router;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/*
 *
 */

class CardFormatter {
    private $card_image_base_url = ""; #"https://res.starwarsccg.org/cards/Images-HT/starwars/";

    public function __construct(Registry $doctrine, Router $router, $rootDir) {
        $this->doctrine = $doctrine;
        $this->router = $router;
        $this->rootDir = $rootDir;
    }

    /**
     * Searches for and replaces symbol tokens with markup in a given text.
     * @param string $text
     * @return string
     */
    public function replaceSymbols($text) {
        static $displayTextReplacements = [
            '[maintain]' => '<span class="icon-maintain"></span>',
            '[recycle]' => '<span class="icon-recycle"></span>',
            '[sacrifice]' => '<span class="icon-martell"></span>',
        ];

        return str_replace(array_keys($displayTextReplacements), array_values($displayTextReplacements), $text);
    }

    /**
     * Remove weird symbols or replace with markup.
     * @param string $text
     * @return string
     */
    public function formatKeywords($text, $api = false) {
        if ($api) {
          static $displayTextReplacements = [
              '\\b0' => '',
              '\\b' => '',
              '\\ul0' => '',
              '\\ul' => '',
              '\\par' => '',
          ];
        } else {
          static $displayTextReplacements = [
              '\\b0' => '</b>',
              '\\b' => '<b>',
              '\\ul0' => '</i>',
              '\\ul' => '<i>',
              '\\par' => '<br/>',
          ];
        }
        return str_replace(array_keys($displayTextReplacements), array_values($displayTextReplacements), $text);
    }

    /**
     * Remove uniqueness indicators (*) or replace with markup.
     * @param string $text
     * @return string
     */
    public function formatUniqueness($text, $api = false) {
      if ($api) {
        static $displayTextReplacements = [
            '*' => '',
            '<>' => '',
        ];
      } else {
        static $displayTextReplacements = [
            '*' => '&bull;',
            '<>' => '&loz;',
        ];
      }
        return str_replace(array_keys($displayTextReplacements), array_values($displayTextReplacements), $text);
    }

    public function splitInParagraphs($text) {
        if (empty($text)) {
            return '';
        }
        return implode(array_map(function ($l) {
            return "<p>$l</p>";
        }, preg_split('/[\r\n]+/', $text)));
    }

    public function formatLocationGametext($cardinfo) {
      $gametext = 'Light:\n';
      $gametext .= $cardinfo['light_side_text'] . '\n\n';
      $gametext .= 'Dark:\n';
      $gametext .= $cardinfo['dark_side_text'];

      return $gametext;
    }

    /**
     *
     * @param \AppBundle\Entity\Card $card
     * @param string $api
     * @return multitype:multitype: string number mixed NULL unknown
     */
    public function getCardInfo(Card $card, $api = false) {
        $cardinfo = [];

        $metadata = $this->doctrine->getManager()->getClassMetadata('AppBundle:Card');
        $fieldNames = $metadata->getFieldNames();
        $associationMappings = $metadata->getAssociationMappings();

        foreach ($associationMappings as $fieldName => $associationMapping) {
            if ($associationMapping['isOwningSide']) {
                $getter = str_replace(' ', '', ucwords(str_replace('_', ' ', "get_$fieldName")));
                $associationEntity = $card->$getter();
                if (!$associationEntity) {
                    continue;
                }

                $cardinfo[$fieldName . '_code'] = $associationEntity->getCode();
                $cardinfo[$fieldName . '_name'] = $associationEntity->getName();
            }
        }

        foreach ($fieldNames as $fieldName) {
            $getter = str_replace(' ', '', ucwords(str_replace('_', ' ', "get_$fieldName")));
            $value = $card->$getter();
            switch ($metadata->getTypeOfField($fieldName)) {
                case 'datetime':
                case 'date':
                    continue 2;
                    break;
                case 'boolean':
                    $value = (boolean) $value;
                    break;
            }
            $fieldName = ltrim(strtolower(preg_replace('/[A-Z]/', '_$0', $fieldName)), '_');
            $cardinfo[$fieldName] = $value;
        }

        $cardinfo['url'] = $this->router->generate('cards_zoom', array('card_code' => $card->getCode()), UrlGeneratorInterface::ABSOLUTE_URL);

        $cardinfo['label'] = $card->getName();
        $cardinfo['image_url'] = $this->card_image_base_url . $cardinfo['image_url'];

        if($cardinfo['image_url2']) {
          $cardinfo['image_url2'] = $this->card_image_base_url . $cardinfo['image_url2'];
        }

        $cardinfo['icon'] = $card->getIcon();

        if ($cardinfo['type_code'] === 'location') {
          $cardinfo['gametext'] = $this->formatLocationGametext($cardinfo);
        }

        if ($api) {
            unset($cardinfo['id']);
        } else {
            $cardinfo['uniqueness'] = $this->formatUniqueness($cardinfo['uniqueness']);
            $cardinfo['gametext'] = $this->replaceSymbols($cardinfo['gametext']);
            $cardinfo['gametext'] = $this->splitInParagraphs($cardinfo['gametext']);
        }

        $cardinfo['characteristics'] = $this->formatKeywords($cardinfo['characteristics'], $api);
        $cardinfo['gametext'] = $this->formatKeywords($cardinfo['gametext'], $api);
        $cardinfo['lore'] = $this->formatKeywords($cardinfo['lore'], $api);

        if (array_key_exists('subtype_code', $cardinfo) && $cardinfo['subtype_code'] == 'site') {
          $cardinfo['is_horizontal'] = true;
        }

        return $cardinfo;
    }
}
