(function app_format(format, $)
{

    /**
     * @memberOf format
     */
    format.traits = function traits(card)
    {
        return card.traits || '';
    };

    /**
     * @memberOf format
     */
    format.name = function name(card)
    {
        return (card.uniqueness ? app.format.uniqueness(card) : '') + card.name;
    }

    format.side = function side(card)
    {
        var text = '<span class="fg-' + card.side_code + ' icon-' + card.side_code + '"></span> ' + card.side_name + '. ';
        return text;
    }

    /**
     * @memberOf format
     */
    format.set = function set(card)
    {
        var text = '<span class="set-name">' + card.set_name + '</span>, <span class="rarity-code">' + card.rarity_code + '</span>';
        return text;
    }

    /**
     * @memberOf format
     */
    format.info = function info(card)
    {
        var text = '';
        switch(card.type_code) {
            case 'effect':
            case 'interrupt':
            case 'weapon':
            case 'vehicle':
                if(card.subtype_name) {
                  text += '<span class="card-subtype">' + card.subtype_name + ' </span>';
                }
                text += '<span class="card-type">' + card.type_name + '. </span>';
                break;
            case 'starship':
                text += '<span class="card-subtype">' + card.subtype_name + ': ' + card.model_type + '</span>';
                break;
            case 'creature':
                text += '<span class="card-subtype">' + card.model_type + ' ' + card.type_name + '</span>';
                break;
            default:
                if(card.subtype_name) {
                  text += '<span class="card-subtype">' + card.subtype_name + '. </span>';
                } else {
                  text += '<span class="card-type">' + card.type_name + '. </span>';
                }
                break;
        }
        return text;
    };

    /**
     * @memberOf format
     */
    format.text = function text(card)
    {
        var text = card.gametext || '';
        text = text.replace(/\[(\w+)\]/g, '<span class="icon-$1"></span>')
        text = text.split("\n").join('</p><p>');
        return '<p>' + text + '</p>';
    };

    /**
     * @memberOf format
     */
    format.uniqueness = function uniqueness(card)
    {
        var text = card.uniqueness || '';
        text = text.replace(/\*/g, '&bull;');
        text = text.replace(/<>/g, '&loz;');
        return text + ' ';
    };

})(app.format = {}, jQuery);
