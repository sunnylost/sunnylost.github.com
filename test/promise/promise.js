/**
 * Promise Object
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-promise-objects
 */
(function() {
	var UNRESOLVED = 'unresolved',
		HAS_RESOLUTION = 'has-resolution',
		HAS_REJECTION  = 'has-rejection';

	function isFunction(fn) {
		return typeof fn === 'function';
	}

	function identity(x) {
		return x;
	}

	function thrower() {
		throw new Error();
	}

	function resolveFn(reason) {
		var status = this.status;
		if(status !== UNRESOLVED) return undefined;

		var reactions = this.resolveReactions;
		this.resolveReactions = undefined;
		this.status = HAS_RESOLUTION;
		this.PromiseResult = reason;

		TriggerPromiseReactions.call(this, reactions, reason);
	}

	function rejectFn(reason) {
		var status = this.status;
		if(status !== UNRESOLVED) return undefined;

		var reactions = this.rejectReactions;
		this.rejectReactions = undefined;
		this.status = HAS_REJECTION;
		this.PromiseResult = reason;

		TriggerPromiseReactions.call(this, reactions, reason);
	}

	function TriggerPromiseReactions(reactions, reason) {
		var i = 0,
			len = reactions.length,
			result;

		for(; i < len; i++) {
			result = reactions[i].call(null, reason);
			typeof result != 'undefined' && (this.PromiseResult = reason = result);
		}
	}

	function Promise(executor) {
		if(!isFunction(executor)) throw new TypeError('Promise constructor takes a function argument.');
		this.status = UNRESOLVED;
		this.resolveReactions = [];
		this.rejectReactions  = [];

		executor.call(null, resolveFn.bind(this), rejectFn.bind(this));
	}

	Promise.prototype = {
		coonstructor: Promise,

		/**
		 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-promise.prototype.catch
		 */
		catch: function(onRejected) {
			return this.then(undefined, onRejected);
		},

		then: function(onFulfilled, onRejected) {
			var status = this.status,
				reason = this.PromiseResult;
			isFunction(onFulfilled) || (onFulfilled = identity);
			isFunction(onRejected)  || (onRejected  = thrower);

			if(status === UNRESOLVED) {
				this.resolveReactions.push(onFulfilled);
				this.rejectReactions.push(onRejected);
			} else if(status === HAS_RESOLUTION) {
				TriggerPromiseReactions.call(this, [onFulfilled], reason);
			} else {
				TriggerPromiseReactions.call(this, [onRejected], reason);
			}
			return this;
		}
	};

	window.myPromise = Promise;
}())