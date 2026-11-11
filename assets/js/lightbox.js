/**
 * CyberMaven lightbox.
 * Gallery images that link to their full-size file open in an on-site
 * viewer instead of leaving the page. Arrow keys step through the gallery,
 * Escape closes. Without JavaScript the links still work as plain links.
 */
( function () {
	'use strict';

	var IMAGE_LINK = /\.(jpe?g|png|gif|webp|avif)(\?.*)?$/i;

	function init() {
		var galleries = document.querySelectorAll( '.wp-block-gallery' );
		if ( ! galleries.length || typeof HTMLDialogElement === 'undefined' ) {
			return;
		}

		var dialog = buildDialog();
		var img = dialog.querySelector( '.cm-lightbox__img' );
		var caption = dialog.querySelector( '.cm-lightbox__caption' );
		var items = [];
		var index = 0;
		var opener = null;

		function show( i ) {
			index = ( i + items.length ) % items.length;
			var item = items[ index ];
			img.src = item.href;
			img.alt = item.alt;
			caption.textContent = item.caption || item.alt;
			caption.hidden = ! caption.textContent;
			// Warm up the neighbours so stepping feels instant.
			[ index + 1, index - 1 ].forEach( function ( n ) {
				var next = items[ ( n + items.length ) % items.length ];
				if ( next ) {
					new Image().src = next.href;
				}
			} );
		}

		function open( group, i, link ) {
			items = group;
			opener = link;
			show( i );
			dialog.showModal();
			document.documentElement.style.overflow = 'hidden';
		}

		dialog.addEventListener( 'close', function () {
			document.documentElement.style.overflow = '';
			img.removeAttribute( 'src' );
			if ( opener ) {
				opener.focus();
			}
		} );

		dialog.querySelector( '.cm-lightbox__close' ).addEventListener( 'click', function () {
			dialog.close();
		} );
		dialog.querySelector( '.cm-lightbox__prev' ).addEventListener( 'click', function () {
			show( index - 1 );
		} );
		dialog.querySelector( '.cm-lightbox__next' ).addEventListener( 'click', function () {
			show( index + 1 );
		} );

		// Clicking the dark space around the picture closes it.
		dialog.addEventListener( 'click', function ( e ) {
			if ( e.target === dialog || e.target.classList.contains( 'cm-lightbox__figure' ) ) {
				dialog.close();
			}
		} );

		dialog.addEventListener( 'keydown', function ( e ) {
			if ( e.key === 'ArrowRight' ) {
				e.preventDefault();
				show( index + 1 );
			} else if ( e.key === 'ArrowLeft' ) {
				e.preventDefault();
				show( index - 1 );
			}
		} );

		// Swipe on phones.
		var touchX = null;
		dialog.addEventListener( 'touchstart', function ( e ) {
			touchX = e.changedTouches[ 0 ].clientX;
		}, { passive: true } );
		dialog.addEventListener( 'touchend', function ( e ) {
			if ( touchX === null ) {
				return;
			}
			var dx = e.changedTouches[ 0 ].clientX - touchX;
			touchX = null;
			if ( Math.abs( dx ) > 50 ) {
				show( index + ( dx < 0 ? 1 : -1 ) );
			}
		}, { passive: true } );

		galleries.forEach( function ( gallery ) {
			var links = Array.prototype.filter.call(
				gallery.querySelectorAll( 'figure.wp-block-image a' ),
				function ( a ) {
					return IMAGE_LINK.test( a.getAttribute( 'href' ) || '' ) && a.querySelector( 'img' );
				}
			);
			var group = links.map( function ( a ) {
				var thumb = a.querySelector( 'img' );
				var cap = a.closest( 'figure' ).querySelector( 'figcaption' );
				return {
					href: a.href,
					alt: thumb.getAttribute( 'alt' ) || '',
					caption: cap ? cap.textContent.trim() : ''
				};
			} );
			links.forEach( function ( a, i ) {
				a.addEventListener( 'click', function ( e ) {
					if ( e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 ) {
						return;
					}
					e.preventDefault();
					open( group, i, a );
				} );
			} );
		} );
	}

	function buildDialog() {
		var dialog = document.createElement( 'dialog' );
		dialog.className = 'cm-lightbox';
		dialog.setAttribute( 'aria-label', 'Image viewer' );
		dialog.innerHTML =
			'<figure class="cm-lightbox__figure"><img class="cm-lightbox__img" alt=""></figure>' +
			'<p class="cm-lightbox__caption"></p>' +
			'<button type="button" class="cm-lightbox__prev" aria-label="Previous image">&lsaquo;</button>' +
			'<button type="button" class="cm-lightbox__next" aria-label="Next image">&rsaquo;</button>' +
			'<button type="button" class="cm-lightbox__close" aria-label="Close viewer">&times;</button>';
		document.body.appendChild( dialog );
		return dialog;
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
}() );
