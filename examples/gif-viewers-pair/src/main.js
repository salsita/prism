require('isomorphic-fetch');

import run from './boilerplate';

import view from './gif-viewers-pair/view';
import updater from './gif-viewers-pair/updater';

run('app', view, updater);
