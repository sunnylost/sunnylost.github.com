window.addEventListener('message', function(e) {
    e.source.postMessage(JSON.stringify({
        msg: 'Ho!'
    }), e.origin);
})