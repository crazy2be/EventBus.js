EventBus.js
===========

Short, sweet, and simple event handling for JavaScript.

	function SimpleTicker() {
		var eventBus = new EventBus();
		this.on = eventBus.on;
		this.off = eventBus.off;

		var previousTime = Date.now();
		window.setInterval(function () {
			var currentTime = Date.now();
			eventBus.fire("tick", currentTime - previousTime);
			previousTime = currentTime;
		}, 100);
	}

	var myTicker = new SimpleTicker();
	myTicker.on("tick", function (dt) {
		console.log("Got tick with dt:", dt);
		if (dt > 200) {
			// We're lagging too bad, ABORT!
			myTicker.off("tick");
		}
	});


Ok, How Do I Use It?
--------------------
Include EventBus.js in your source code. If you are creating a library,
EventBus is small enough to copy and paste into your library (263 BYTES after
minification + gzip!).

Aaaand... The API:

	function EventBus() {
		var self = this;
		var callbacks = {};

		// remove modifies the list which it is passed,
		// removing all occurances of val.
		function remove(list, val) {
			for (var i = 0; i < list.length; i++) {
				if (list[i] === val) {
					list.splice(i, 1);
				}
			}
		}

		// Register a callback for the specified event. If the
		// callback is already registered for the event, it is
		// not added again.
		self.on = function (ev, cb) {
			var list = callbacks[ev] || [];
			remove(list, cb);
			list.push(cb);
			callbacks[ev] = list;
			return self;
		}

		// Remove a callback for the specified event. If the callback
		// has not been registered, it does not do anything.
		self.off = function (ev, cb) {
			var list = callbacks[ev];
			if (!list) return;
			remove(list, cb);
			return self;
		}

		// Fire an event, passing each registered handler all of
		// the specified arguments. Within the handler, this is
		// set to null.
		self.fire = function (ev, arg1, arg2/*, ...*/) {
			var list = callbacks[ev];
			if (!list) return;
			var args = Array.prototype.slice.call(arguments, 1);
			for (var i = 0; i < list.length; i++) {
				list[i].apply(null, args);
			}
			return self;
		}
	}


Inspiration:
------------

Evented programming is a really useful way to express the manner in which
many things within your code happen. For example, rather than polling the
window object every few milliseconds to see if it has resized, and updating
accordingly, JavaScript natively has the idea of a `resize` event, available
on the `window` object. You listen for it like this:

	window.onresize = function (event) {
		// Handle the window resize
	};

This is a //very nice thing//. Unfortunately, it has some limitations. The
biggest limitation by far is that libraries have no way to listen for events
without risking either breaking client code, or having client code break
them. Thus, the `addEventListener` API came into being:

	window.addEventListener('resize', function (event) {
		// Handle the window resize
	}, false);

However, many in the JavaScript community found the verbosity tiring -
especially considering listening for events is so fundamental to the way
most JavaScript programs operate. That, combined with the fact that
Microsoft had their own `addListener` API, lead jQuery creators to make
their own wrapper for this operation, concicely named `on`. In this new
world, the API was both clean and robust:

	$(window).on('resize', function (event) {
		// Handle the window resize
	});

And here, it seems, the world has mostly settled- at least, if you are
writing code that interacts with the DOM directly. However, as more and
more libraries come out that have **no** interaction with the DOM
whatsoever (such as THREE.js), or choose not to use native browser events
for performance reasons (such as iScroll), we are seeing a new termoil.
Many of these programmers are comming from backgrounds of Java or C++,
where events are cumbersome anyways, and bringing their heavyweight APIs
along with them, not realizing the progress that has been made in the
JavaScript community. Many of them are inflexible, work in subtly different
ways in edge cases, and have wildly different naming conventions.

This is not the first JavaScript library to offer event handling, but it
certainly is the fastest, smallest, and simplest. It does exactly what is
needed, nothing less, nothing more.
