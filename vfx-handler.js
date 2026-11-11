// ---------------
// MESSAGE VISUALIZATION ROUTING
// https://stackoverflow.com/questions/54389085/use-the-audiocontext-as-audio-input-in-p5-js
// https://aws.amazon.com/blogs/business-productivity/transforming-audio-and-shared-content-in-the-amazon-chime-sdk-for-javascript/
// ---------------

function getTap() {
    if (!audioTap) {
        const context = getAudioContext();
        audioTap = context.createGain(); // ito naman kasi vinivisualize natin
        audioTap.connect(context.destination);
    }

    return audioTap;
}

function routeToVisualizer( aMessage ) {
    if (audioSources.has(aMessage)) {
        return;
    }

    const context = getAudioContext();
    const node = context.createMediaElementSource(aMessage);
    const tap = getTap();
    
    node.connect(tap);
    
    audioSources.set(aMessage, node);
}