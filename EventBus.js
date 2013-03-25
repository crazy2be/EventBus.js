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
