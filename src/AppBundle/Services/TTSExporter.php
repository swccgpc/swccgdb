<?php

namespace AppBundle\Services;

use AppBundle\Services\CardFormatter;
use AppBundle\Services\Texts;
use Symfony\Component\HttpFoundation\RequestStack;

/*
 *
 */

class TTSExporter
{

    public function __construct(CardFormatter $card_formatter, RequestStack $request_stack, Texts $texts, $project_dir)
    {
        $this->cardFormatter = $card_formatter;
        $this->imagesBaseUrl = $request_stack->getCurrentRequest()->getSchemeAndHttpHost() . '/images/';
        $this->texts = $texts;
        $this->imagesPath = $project_dir . '/web/images/';
    }

    public function getExportData($deck)
    {
        $cards = [];
        foreach ($deck->getSlots() as $slot) {
          $cards[] = $this->cardFormatter->getCardInfo($slot->getCard(), true);
        }
        $cardBackFileName = $this->getCardBackFileName($deck);
        $cardBackUrl = $this->imagesBaseUrl . $cardBackFileName . '?v=' . time();
        $cardFaceUrl = $this->getCardFaceUrl($deck, $cardBackFileName, $cards);
        return [
            'name' => $deck->getName(),
            'description' => $deck->getDescriptionMd(),
            'version' => $deck->getVersion(),
            'cards' => $cards,
            'face_url' => $cardFaceUrl,
            'back_url' => $cardBackUrl,
        ];
    }

    public function getCardFaceUrl($deck, $cardBackFileName, $cards)
    {
      $cardWidth = 350;
      $cardHeight = 490;
      $numColumns = 10;
      $numRows = 7;
      $combinedImage = imagecreatetruecolor($cardWidth * $numColumns, $cardHeight * $numRows);
      foreach ($cards as $i => $card) {
        $cardImage = imagecreatefromgif($card['image_url']);
        $cardColumn = $i % $numColumns;
        $cardRow = intval(floor($i / $numColumns));
        $destX = $cardWidth * $cardColumn;
        $destY = $cardHeight * $cardRow;
        if (array_key_exists('subtype_code', $card) && $card['subtype_code'] == 'site') {
          $cardImage = imagerotate($cardImage, 270, 0);
        }
        imagecopy($combinedImage, $cardImage, $destX, $destY, 0, 0, $cardWidth, $cardHeight);
      }
      $backCardImage = imagecreatefromjpeg($this->imagesPath . $cardBackFileName);
      $backCardDestX = $cardWidth * ($numColumns - 1);
      $backCardDestY = $cardHeight * ($numRows - 1);
      imagecopy($combinedImage, $backCardImage, $backCardDestX, $backCardDestY, 0, 0, $cardWidth, $cardHeight);
      $fileName = 'ttsdecks/' . $this->texts->slugify($deck->getId() . '_' . $deck->getName()) . '.jpg';
      imagejpeg($combinedImage, $this->imagesPath . $fileName);
      imagedestroy($combinedImage);
      return $this->imagesBaseUrl . $fileName . '?v=' . time();
    }

    public function getCardBackFileName($deck)
    {
      $cardBackFileName = 'light-back.jpg';
      if ($deck->getSide()->getCode() === 'dark') {
        $cardBackFileName = 'dark-back.jpg';
      }
      return $cardBackFileName;
    }
}
