#!/usr/bin/env python3

import bottle
import os
import json
import yaml


ROOT_PATH = os.path.dirname(__file__)
CONFIG_FILE = yaml.full_load(open(os.path.join(ROOT_PATH, 'config.yaml')).read())
STORAGE_PATH = os.path.join(ROOT_PATH, 'storage')
TRANSLATION = {
    'fruits': {
        'name': 'Fructe',
        'row_dimension': '',
        'col_number': '3'
    },
    'vegetables': {
        'name': 'Legume',
        'row_dimension': '',
        'col_number': '3'
    },
    'frozen1': {
        'name': 'Congelate 1',
        'row_dimension': '',
        'col_number': '3'
    },
    'frozen2': {
        'name': 'Congelate 2',
        'row_dimension': '',
        'col_number': '3'
    },
    'fish': {
        'name': 'Pește',
        'row_dimension': '-4',
        'col_number': '2'
    },
    'frozen_vegetables': {
        'name': 'Preparate congelate',
        'row_dimension': '-8',
        'col_number': '4'
    }
}

if not os.path.exists(STORAGE_PATH):
    os.makedirs(STORAGE_PATH)


@bottle.route('/')
def home():
    gama1 = TRANSLATION[bottle.request.query.get('gama1')]
    gama2 = TRANSLATION[bottle.request.query.get('gama2')]
    return bottle.template(os.path.join(ROOT_PATH, 'static', 'html', 'index.html'), 
            gama1=gama1['name'], gama1_dim=gama1['row_dimension'], gama1_row=gama1['col_number'],
            gama2=gama2['name'], gama2_dim=gama2['row_dimension'], gama2_row=gama2['col_number'])


@bottle.route('/save_prices', method='POST')
def save_local():
    prices = json.loads(bottle.request.body.read())
    gama = bottle.request.query.get('gama')

    # "sanitize" data
    prices = prices[gama]
    for i, d in enumerate(prices):
        for k in d:
            if type(prices[i][k]) is str:
                prices[i][k] = prices[i][k].strip()
    
    with open(os.path.join(STORAGE_PATH, '%s.txt' % (gama,)), 'w') as fw:
        for f in prices:
            fw.write('%s|%s|%s|%s\n' % (f['name'], f['price'], f['um'], f['quantity']))
        
    return 'OK'


@bottle.route('/local_prices', method='GET')
def get_local_prices():
    gama = bottle.request.query.get('gama')

    obj = {gama: []}
    if not os.path.isfile(os.path.join(STORAGE_PATH, '%s.txt' % (gama,))):
        return obj

    with open(os.path.join(STORAGE_PATH, '%s.txt' % (gama,))) as fr:
        for l in fr.readlines():
            name, price, um, quantity = l.split('|')
            obj[gama].append({'name': name, 'price': price, 'um': um, 'quantity': quantity})

    bottle.response.content_type = 'application/json'
    return json.dumps(obj)



@bottle.route(r'/static/<resource>/<filepath:re:.*\.*(css|js|ttf|png)>', method='GET')
def static_resource(resource, filepath):
    return bottle.static_file(filepath, root=os.path.join(ROOT_PATH, 'static', resource))


@bottle.route('/favicon.ico', method='GET')
def favicon():
    return bottle.static_file('favicon.ico', root=os.path.join(ROOT_PATH, 'static', 'resources'))


if __name__ == '__main__':
    bottle.debug(CONFIG_FILE['http_server']['debug'])

    bottle.run(
        host=CONFIG_FILE['http_server']['host'],
        port=CONFIG_FILE['http_server']['port'],
        reloader=CONFIG_FILE['http_server']['debug'],
        server='paste')
