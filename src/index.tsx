import * as angular from 'angular';
import * as React from 'react';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import RamaComponent from './RamaComponent';
import { react2angular } from 'react2angular';

angular
    .module('app', [])
    .component('ramachandranComponent', react2angular(RamaComponent, ['pdbid', 'chainstoshow', 'modelstoshow']));
