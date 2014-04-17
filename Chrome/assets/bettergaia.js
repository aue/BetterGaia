/*
bettergaia.js
cross browser framework for browser extension apis
inspired by xkit
Copyright (c) BetterGaia and Bowafishtech
*/
/*global localStorage: false, console: false, $: false, chrome: false, BetterGaia: false, Storage: false */
/*jshint sub:true */

BetterGaia.urlCheck('true');

// First run, download data
if (typeof Storage.data['installed'] === 'boolean' && Storage.data['installed'] === false) {
	Storage.set('installed', true);	
}