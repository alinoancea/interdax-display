$(document).ready(function() {
    let gama1 = getUrlVars()['gama1']; // left side
    let gama2 = getUrlVars()['gama2']; // right side

    get_and_display_local_products('left', gama1);
    get_and_display_local_products('right', gama2);
    

    setInterval(function () {
        get_remote_products('left', gama1);
        get_remote_products('right', gama2);
    }, 30000);
});

function get_remote_products(side, gama) {
    $.ajax({
        type: 'GET',
        url: 'http://Central.local:18766/json_items?gama=' + gama,
        dataType: 'json',
        timeout: 20000,
        success: function (result, status, xhr) {
            if (gama == 'fruits' || gama == 'vegetables')
                result = result[gama];
            // save prices locally
            $.ajax({
                type: 'POST',
                url: 'http://127.0.0.1:26752/save_prices?gama=' + gama,
                contentType: 'application/json',
                data: JSON.stringify(result)
            });

            if (side == 'left')
            {
                var panel = $('.left-elements')[0];
                $('.left-elements > .price-col').remove();
            }
            else
            {
                var panel = $('.right-elements')[0];
                $('.right-elements > .price-col').remove();
            }
            add_elements_to_panel(result[gama], panel);
            resize_prices();
        }
    });
}

function get_and_display_local_products(side, gama) {
    $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:26752/local_prices?gama=' + gama,
        dataType: 'json',
        success: function (result, status, xhr) {
            result = result[gama];
            if (side == 'left')
            {
                var panel = $('.left-elements')[0];
                $('.left-elements > .price-col').remove();
            }
            else
            {
                var panel = $('.right-elements')[0];
                $('.right-elements > .price-col').remove();
            }
            add_elements_to_panel(result, panel);
            resize_prices();
        }
    });
}

function getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
}


function add_elements_to_panel(elements, panel) {
    let custom_element_pos = parseInt(panel.className.split(' ')[1].split('-').pop());
    let actual_pos = 0;
    for (let i = 0; i < elements.length; i++) {
        if (parseFloat(elements[i]['price']) == 0.01) {
            continue;
        }
        if (elements[i]['quantity'] == 0) {
            continue;
        }
        actual_pos += 1;
        let new_col_el = $('<div>').addClass('col p-0 m-0 price-col');
        let inner_col_el = $('<div>').addClass('price rounded ml-2 mt-2 mb-0 p-1');
        if (actual_pos % custom_element_pos == 0) {
            inner_col_el.addClass('mr-2');
        }
        inner_col_el.append(elements[i]['name'] + '<br />' + elements[i]['price'] + ' RON/' + elements[i]['um']);
        inner_col_el.appendTo(new_col_el);
        new_col_el.appendTo(panel);
    }
}

function resize_prices() {
    var el, elements, _i, _len, _results;
        elements = $('.price');
        if (elements.length < 0) {
            exit;
        }
        _results = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
            el = elements[_i];
            _results.push((function(el) {
                var resizeText, _results1;
                resizeText = function() {
                    var elNewFontSize;
                    elNewFontSize = (parseInt($(el).css('font-size').slice(0, -2)) - 1) + 'px';
                    return $(el).css('font-size', elNewFontSize);
                };
                _results1 = [];
                while (el.scrollHeight > el.offsetHeight) {
                    _results1.push(resizeText());
                }
                return _results1;
            })(el));
        }
}