/**
 * Inline, render-blocking snippet placed in <head> by the root layout.
 * Runs before first paint, so returning visitors never see a single frame of
 * the intro overlay (no flash), and first-time visitors get
 * `data-nf-intro="play"`, which also delays the hero choreography until the
 * CRT shutter opens.
 *
 * Kept in a plain (non-"use client") module so the server layout receives the
 * actual string rather than a client reference.
 */
export const FIRST_LOAD_INTRO_SCRIPT = `(function(){try{var d=document.documentElement;if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.setAttribute('data-nf-intro','skip');return;}if(sessionStorage.getItem('nf26_intro_seen')){d.setAttribute('data-nf-intro','skip');}else{sessionStorage.setItem('nf26_intro_seen','1');d.setAttribute('data-nf-intro','play');}}catch(e){}})();`;
