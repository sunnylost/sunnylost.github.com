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

	/**
	 * resolve 函数的默认值
	 */
	function identity(x) {
		return x;
	}

	/**
	 * reject 函数的默认值
	 */
	function thrower() {
		throw new Error();
	}

	function IsPromise(promise) {
		return promise instanceof Promise;
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
		var len = reactions.length,
			reaction,
			result;

		while(len--) {
			reaction = reactions.shift();
			result = reaction.call(null, reason);
			if(typeof result != 'undefined') {
				if(IsPromise(result)) {
					result.resolveReactions = this.resolveReactions || reactions;
					result.rejectReactions  = this.rejectReactions  || reactions;
					return result;
				}
				this.PromiseResult = reason = result;
			}
		}
	}

	function Promise(executor) {
		if(!isFunction(executor)) throw new TypeError('Promise constructor takes a function argument.');
		this.status = UNRESOLVED;
		this.resolveReactions = [];
		this.rejectReactions  = [];

		var resolve = resolveFn.bind(this),
			reject  = rejectFn.bind(this);

		executor.call(null, resolve, reject);
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