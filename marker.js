var changeAnimationDuration = 500;
var resizeAnimationDuration = 1000;

function Marker(poiData) {
    this.hasVideoStarted = false,
    this.poiData = poiData;
    this.isSelected = false;
    this.createdVideo = false;

    /*
        With AR.PropertyAnimations you are able to animate almost any property of ARchitect objects. This sample
        will animate the opacity of both background drawables so that one will fade out while the other one fades
        in. The scaling is animated too. The marker size changes over time so the labels need to be animated too in
        order to keep them relative to the background drawable. AR.AnimationGroups are used to synchronize all
        animations in parallel or sequentially.
    */
    this.animationGroupIdle = null;
    this.animationGroupSelected = null;
    this.video = null;
    this.markerButton = null;
    this.playButtonImg = null;
    this.playButton = null;
    this.model = null;
    this.distance = null;

    /* Create the AR.GeoLocation from the poi data. */
    this.markerLocation = new AR.GeoLocation(poiData.latitude, poiData.longitude, poiData.altitude);

    /* Create an AR.ImageDrawable for the marker in idle state. */
    //this.markerDrawableIdle = new AR.ImageDrawable(World.markerDrawableIdle, 2.5, {
    this.markerDrawableIdle = new AR.ImageDrawable(World.markerImageRessources.idle[poiData.type], 1.2, {
        zOrder: 0,
        opacity: 1.0,
        /*
            To react on user interaction, an onClick property can be set for each AR.Drawable. The property is a
            function which will be called each time the user taps on the drawable. The function called on each tap
            is returned from the following helper function defined in marker.js. The function returns a function
            which checks the selected state with the help of the variable isSelected and executes the appropriate
            function. The clicked marker is passed as an argument.
        */
        onClick: Marker.prototype.getOnClickTrigger(this)
    });


    /* Create an AR.ImageDrawable for the marker in selected state. */
    //this.markerDrawableSelected = new AR.ImageDrawable(World.markerDrawableSelected, 2.5, {
    this.markerDrawableSelected = new AR.ImageDrawable(World.markerImageRessources.selected[poiData.type], 1.2, {
        zOrder: 0,
        opacity: 0.0,
        onClick: null
    });

    /* Create an AR.Label for the marker's title . */
    this.titleLabel = new AR.Label(poiData.title.trunc(20), 0.5, {
        zOrder: 1,
        translate: {
            y: 0.3
        },
        style: {
            textColor: '#FFFFFF',
            fontStyle: AR.CONST.FONT_STYLE.BOLD
        }
    });
    this.distance = (this.markerLocation.distanceToUser() > 999) ? ((this.markerLocation.distanceToUser() / 1000).toFixed(2) + " km") : (Math.round(this.markerLocation.distanceToUser()) + " m");
    this.descriptionLabel = new AR.Label(this.distance, 0.5, {
        zOrder: 1,
        translate: {
            y: -0.18
        },
        style: {
            textColor: '#FFFFFF'
        }
    });
    /*
        Create an AR.ImageDrawable using the AR.ImageResource for the direction indicator which was created in the
        World. Set options regarding the offset and anchor of the image so that it will be displayed correctly on
        the edge of the screen.
    */
    this.directionIndicatorDrawable = new AR.ImageDrawable(World.markerDrawableDirectionIndicator, 0.1, {
        enabled: false,
        verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP
    });
    /*
        The representation of an AR.GeoObject in the radar is defined in its drawables set (second argument of
        AR.GeoObject constructor).
        Once drawables.radar is set the object is also shown on the radar e.g. as an AR.Circle
    */
    this.radarCircle = new AR.Circle(0.03, {
        horizontalAnchor: AR.CONST.HORIZONTAL_ANCHOR.CENTER,
        opacity: 0.8,
        style: {
            fillColor: "#ffffff"
        }
    });
    /*
        Additionally create circles with a different color for the selected state.
    */
    this.radarCircleSelected = new AR.Circle(0.05, {
        horizontalAnchor: AR.CONST.HORIZONTAL_ANCHOR.CENTER,
        opacity: 0.8,
        style: {
            fillColor: "#0066ff"
        }
    });

    this.radardrawables = [];
    this.radardrawables.push(this.radarCircle);

    this.radardrawablesSelected = [];
    this.radardrawablesSelected.push(this.radarCircleSelected);
    /*
        Create the AR.GeoObject with the drawable objects and define the AR.ImageDrawable as an indicator target on
        the marker AR.GeoObject. The direction indicator is displayed automatically when necessary. AR.Drawable
        subclasses (e.g. AR.Circle) can be used as direction indicators.
    */
    this.markerObject = new AR.GeoObject(this.markerLocation, {
        drawables: {
            // cam: [this.markerDrawableIdle, this.markerDrawableSelected, this.titleLabel, this.descriptionLabel],
            //cam: [this.markerButton, this.video, this.markerDrawableIdle, this.markerDrawableSelected, this.titleLabel],
            cam: [this.markerDrawableIdle, this.markerDrawableSelected, this.titleLabel, this.descriptionLabel],
            indicator: this.directionIndicatorDrawable,
            radar: this.radardrawables
        }
    });
    return this;
}
Marker.prototype.getOnClickTrigger = function (marker) {
    return function () {
        console.log(marker);
        if (!Marker.prototype.isAnyAnimationRunning(marker)) {
            if (marker.isSelected) {
                Marker.prototype.setDeselected(marker);
                if (marker.createdVideo) {
                    marker.video.destroy();
                    marker.markerButton.destroy();
                    marker.playButton.destroy();
                    marker.playButtonImg.destroy();
                    marker.model.destroy();
                } else {
                    marker.markerButton.destroy();
                }
            } else {
                Marker.prototype.setSelected(marker);
                World.distance = Math.round(marker.distanceToUser);
                if (World.distance < 400) {
                    marker.createdVideo = true;
                    // var location = new AR.RelativeLocation(null, 5, 0, -1);
                    var location = new AR.RelativeLocation(marker.markerLocation, 5, 0, 10);
                    marker.model = new AR.Model(marker.poiData.model, {
                        // onLoaded: this.worldLoaded,
                        translate: {
                            zOrder: 1,
                            x: -5,
                            y: -8,
                        },
                        onError: World.onError,
                        scale: {
                            x: 2,
                            y: 2,
                            z: 2
                        }
                    });
                    marker.markerButton = new AR.ImageDrawable(World.markerImagebutton, 1, {
                        zOrder: 0,
                        opacity: 1.0,
                        translate: {
                            zOrder: 1,
                            x: 2,
                            y: -3,
                        },
                        onClick: Marker.prototype.getOnClickbutton(marker),
                    });
                    marker.playButtonImg = new AR.ImageResource("assets/playButton.png", {
                        onError: World.onError
                    });
                    marker.playButton = new AR.ImageDrawable(marker.playButtonImg, 6, {
                        enabled: false,
                        clicked: false,
                        zOrder: 2,
                        onClick: function playButtonClicked() {
                            marker.video.play(-1);
                            marker.video.playing = true;
                            marker.playButton.clicked = true;
                        },
                        translate: {
                            y: -7
                        }
                    });
                    marker.video = new AR.VideoDrawable(marker.poiData.video, 6, {
                        translate: {
                            y: marker.playButton.translate.y
                        },
                        zOrder: 1,
                        onLoaded: function videoLoaded() {
                            marker.playButton.enabled = true;
                        },
                        onPlaybackStarted: function videoPlaying() {
                            marker.playButton.enabled = false;
                            marker.video.enabled = true;
                        },
                        onFinishedPlaying: function videoFinished() {
                            marker.playButton.enabled = true;
                            marker.video.playing = false;
                            marker.video.enabled = false;
                        },
                        onClick: function videoClicked() {
                            if (marker.playButton.clicked) {
                                marker.playButton.clicked = false;
                            } else if (marker.video.playing) {
                                marker.video.pause();
                                marker.video.playing = false;
                            } else {
                                marker.video.resume();
                                marker.video.playing = true;
                            }
                        },
                        onError: World.onError
                    });

                    // marker.markerObject = new AR.GeoObject(marker.markerLocation, {
                    marker.markerObject = new AR.GeoObject(location, {
                        drawables: {
                            cam: [marker.video, marker.playButton, marker.markerButton, marker.model],
                            //cam: [this.htmlDrawable],
                        }
                    });

                } else {
                    marker.createdVideo = false;
                    marker.markerButton = new AR.ImageDrawable(World.markerImagebutton, 1, {
                        zOrder: 0,
                        opacity: 1.0,
                        translate: {
                            zOrder: 1,
                            x: 2,
                            y: -1.2,
                        },
                        onClick: Marker.prototype.getOnClickbutton(marker),
                    });
                    marker.markerObject = new AR.GeoObject(marker.markerLocation, {
                        drawables: {
                            cam: [marker.markerButton],
                        }
                    });
                }
                try {
                    World.onMarkerSelected(marker);
                    //  }
                } catch (err) {
                    alert(err);
                }
            }
        } else {
            AR.logger.debug('a animation is already running');
        }

        return true;
    };
};

Marker.prototype.getOnClickbutton = function (marker) {
    return function () {
        if (marker.isSelected) {
            World.showDetail(marker);
        }
        return true;
    };

};

/*
    Property Animations allow constant changes to a numeric value/property of an object, dependent on start-value,
    end-value and the duration of the animation. Animations can be seen as functions defining the progress of the
    change on the value. The Animation can be parametrized via easing curves.
*/
Marker.prototype.setSelected = function (marker) {
    var markerid = marker.poiData.id;
    console.log(markerid);
    marker.isSelected = true;
    if (marker.animationGroupSelected === null) {
        var easingCurve = new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
            amplitude: 2.0
        });

        /* Create AR.PropertyAnimation that animates the opacity to 0.0 in order to hide the idle-state-drawable. */
        var hideIdleDrawableAnimation = new AR.PropertyAnimation(
            marker.markerDrawableIdle, "opacity", null, 0.0, changeAnimationDuration);
        /* Create AR.PropertyAnimation that animates the opacity to 1.0 in order to show the selected-state-drawable. */
        var showSelectedDrawableAnimation = new AR.PropertyAnimation(
            marker.markerDrawableSelected, "opacity", null, 1.0, changeAnimationDuration);

        /* Create AR.PropertyAnimation that animates the scaling of the idle-state-drawable to 1.2. */
        var idleDrawableResizeAnimationX = new AR.PropertyAnimation(
            marker.markerDrawableIdle, 'scale.x', null, 1.2, resizeAnimationDuration, easingCurve);
        /* Create AR.PropertyAnimation that animates the scaling of the selected-state-drawable to 1.2. */
        var selectedDrawableResizeAnimationX = new AR.PropertyAnimation(
            marker.markerDrawableSelected, 'scale.x', null, 1.2, resizeAnimationDuration, easingCurve);
        /* Create AR.PropertyAnimation that animates the scaling of the title label to 1.2. */
        var titleLabelResizeAnimationX = new AR.PropertyAnimation(
            marker.titleLabel, 'scale.x', null, 1.2, resizeAnimationDuration, easingCurve);
        /* Create AR.PropertyAnimation that animates the scaling of the description label to 1.2. */
        var descriptionLabelResizeAnimationX = new AR.PropertyAnimation(
            marker.descriptionLabel, 'scale.x', null, 1.2, resizeAnimationDuration, easingCurve);

        /* Create AR.PropertyAnimation that animates the scaling of the idle-state-drawable to 1.2. */
        var idleDrawableResizeAnimationY = new AR.PropertyAnimation(
            marker.markerDrawableIdle, 'scale.y', null, 1.2, resizeAnimationDuration, easingCurve);
        /* Create AR.PropertyAnimation that animates the scaling of the selected-state-drawable to 1.2. */
        var selectedDrawableResizeAnimationY = new AR.PropertyAnimation(
            marker.markerDrawableSelected, 'scale.y', null, 1.2, resizeAnimationDuration, easingCurve);
        /* Create AR.PropertyAnimation that animates the scaling of the title label to 1.2. */
        var titleLabelResizeAnimationY = new AR.PropertyAnimation(
            marker.titleLabel, 'scale.y', null, 1.2, resizeAnimationDuration, easingCurve);
        /* Create AR.PropertyAnimation that animates the scaling of the description label to 1.2. */
        var descriptionLabelResizeAnimationY = new AR.PropertyAnimation(
            marker.descriptionLabel, 'scale.y', null, 1.2, resizeAnimationDuration, easingCurve);
        marker.animationGroupSelected = new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL, [
            hideIdleDrawableAnimation,
            showSelectedDrawableAnimation,
            idleDrawableResizeAnimationX,
            selectedDrawableResizeAnimationX,
            titleLabelResizeAnimationX,
            descriptionLabelResizeAnimationX,
            idleDrawableResizeAnimationY,
            selectedDrawableResizeAnimationY,
            titleLabelResizeAnimationY,
            descriptionLabelResizeAnimationY,
        ]);
    }

    /* Removes function that is set on the onClick trigger of the idle-state marker. */
    marker.markerDrawableIdle.onClick = null;
    for (var i = 0; i < World.markerList.length; i++) {
        /* if (World.markerList[i].poiData.id != markerid) {
             World.markerList[i].markerObject.enabled = false;
         }*/
        World.markerList[i].markerDrawableIdle.onClick = null;
    }
    /* Sets the click trigger function for the selected state marker. */
    marker.markerDrawableSelected.onClick = Marker.prototype.getOnClickTrigger(marker);

    /* Enables the direction indicator drawable for the current marker. */
    marker.directionIndicatorDrawable.enabled = true;
    /* Starts the selected-state animation. */
    marker.animationGroupSelected.start();
};

Marker.prototype.setDeselected = function (marker) {
    marker.isSelected = false;

    if (marker.animationGroupIdle === null) {
        var easingCurve = new AR.EasingCurve(AR.CONST.EASING_CURVE_TYPE.EASE_OUT_ELASTIC, {
            amplitude: 2.0
        });

        /* Create AR.PropertyAnimation that animates the opacity to 1.0 in order to show the idle-state-drawable. */
        var showIdleDrawableAnimation = new AR.PropertyAnimation(
            marker.markerDrawableIdle, "opacity", null, 1.0, changeAnimationDuration);
        /* Create AR.PropertyAnimation that animates the opacity to 0.0 in order to hide the selected-state-drawable. */
        var hideSelectedDrawableAnimation = new AR.PropertyAnimation(
            marker.markerDrawableSelected, "opacity", null, 0, changeAnimationDuration);
        /* Create AR.PropertyAnimation that animates the scaling of the idle-state-drawable to 1.0. */
        var idleDrawableResizeAnimationX = new AR.PropertyAnimation(
            marker.markerDrawableIdle, 'scale.x', null, 1.0, resizeAnimationDuration, easingCurve);
        /* Create AR.PropertyAnimation that animates the scaling of the selected-state-drawable to 1.0. */
        var selectedDrawableResizeAnimationX = new AR.PropertyAnimation(
            marker.markerDrawableSelected, 'scale.x', null, 1.0, resizeAnimationDuration, easingCurve);
        /* Create AR.PropertyAnimation that animates the scaling of the title label to 1.0. */
        var titleLabelResizeAnimationX = new AR.PropertyAnimation(
            marker.titleLabel, 'scale.x', null, 1.0, resizeAnimationDuration, easingCurve);
        /* Create AR.PropertyAnimation that animates the scaling of the description label to 1.0. */
        var descriptionLabelResizeAnimationX = new AR.PropertyAnimation(
            marker.descriptionLabel, 'scale.x', null, 1.0, resizeAnimationDuration, easingCurve);
        /* Create AR.PropertyAnimation that animates the scaling of the idle-state-drawable to 1.0. */
        var idleDrawableResizeAnimationY = new AR.PropertyAnimation(
            marker.markerDrawableIdle, 'scale.y', null, 1.0, resizeAnimationDuration, easingCurve);
        /* Create AR.PropertyAnimation that animates the scaling of the selected-state-drawable to 1.0. */
        var selectedDrawableResizeAnimationY = new AR.PropertyAnimation(
            marker.markerDrawableSelected, 'scale.y', null, 1.0, resizeAnimationDuration, easingCurve);
        /* Create AR.PropertyAnimation that animates the scaling of the title label to 1.0. */
        var titleLabelResizeAnimationY = new AR.PropertyAnimation(
            marker.titleLabel, 'scale.y', null, 1.0, resizeAnimationDuration, easingCurve);
        var titleLabelshow = new AR.PropertyAnimation(
            marker.titleLabel, "opacity", null, 1.0, changeAnimationDuration);
        /* Create AR.PropertyAnimation that animates the scaling of the description label to 1.0. */
        var descriptionLabelResizeAnimationY = new AR.PropertyAnimation(
            marker.descriptionLabel, 'scale.y', null, 1.0, resizeAnimationDuration, easingCurve);

        marker.animationGroupIdle = new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL, [
            showIdleDrawableAnimation,
            hideSelectedDrawableAnimation,
            idleDrawableResizeAnimationX,
            selectedDrawableResizeAnimationX,
            titleLabelResizeAnimationX,
            descriptionLabelResizeAnimationX,
            idleDrawableResizeAnimationY,
            selectedDrawableResizeAnimationY,
            titleLabelResizeAnimationY,
            titleLabelshow,
            descriptionLabelResizeAnimationY,
        ]);
    }

    /* Sets the click trigger function for the idle state marker. */
    for (var i = 0; i < World.markerList.length; i++) {
        World.markerList[i].markerDrawableIdle.onClick = Marker.prototype.getOnClickTrigger(World.markerList[i]);
    }
    //for (var i = 0; i < World.markerList.length; i++) {
    // World.markerList[i].markerObject.enabled = true;
    //World.markerList[i].markerDrawableIdle.onClick = null;
    // }
    marker.markerDrawableIdle.onClick = Marker.prototype.getOnClickTrigger(marker);
    /* Removes function that is set on the onClick trigger of the selected-state marker. */
    marker.markerDrawableSelected.onClick = null;

    /* Disables the direction indicator drawable for the current marker. */
    marker.directionIndicatorDrawable.enabled = false;
    /* Starts the idle-state animation. */
    marker.animationGroupIdle.start();
};
Marker.prototype.setHide = function (marker) {
    marker.isSelected = false;
    marker.markerDrawableIdle.enabled = false;

    /* New: . */
    /* Create AR.PropertyAnimation that animates the opacity to 0.0 in order to hide the idle-state-drawable. */
    var hideIdleDrawableAnimation = new AR.PropertyAnimation(
        marker.markerDrawableIdle, "opacity", null, 0.0, changeAnimationDuration);
    /* Create AR.PropertyAnimation that animates the opacity to 1.0 in order to show the selected-state-drawable. */
    var showSelectedDrawableAnimation = new AR.PropertyAnimation(
        marker.markerDrawableSelected, "opacity", null, 0.0, changeAnimationDuration);
    var titleLabelResizeAnimationY = new AR.PropertyAnimation(
        marker.titleLabel, "opacity", null, 0.0, changeAnimationDuration);

    /*
        There are two types of AR.AnimationGroups. Parallel animations are running at the same time,
        sequentials are played one after another. This example uses a parallel AR.AnimationGroup.
    */
    marker.animationGroupSelected = new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL, [
        hideIdleDrawableAnimation,
        showSelectedDrawableAnimation,
        titleLabelResizeAnimationY
    ]);

    /* Starts the selected-state animation. */
    marker.animationGroupSelected.start();
};
Marker.prototype.setShow = function (marker) {
    marker.isSelected = false;
    marker.markerDrawableIdle.enabled = true;
    /* Create AR.PropertyAnimation that animates the opacity to 0.0 in order to hide the idle-state-drawable. */
    var showIdleDrawableAnimation = new AR.PropertyAnimation(
        marker.markerDrawableIdle, "opacity", null, 1.0, changeAnimationDuration);
    /* Create AR.PropertyAnimation that animates the opacity to 1.0 in order to show the selected-state-drawable. */
    var showSelectedDrawableAnimation = new AR.PropertyAnimation(
        marker.markerDrawableSelected, "opacity", null, 0.0, changeAnimationDuration);
    var titleLabelResizeAnimationY = new AR.PropertyAnimation(
        marker.titleLabel, "opacity", null, 1.0, changeAnimationDuration);
    /*
        There are two types of AR.AnimationGroups. Parallel animations are running at the same time,
        sequentials are played one after another. This example uses a parallel AR.AnimationGroup.
    */
    marker.animationGroupSelected = new AR.AnimationGroup(AR.CONST.ANIMATION_GROUP_TYPE.PARALLEL, [
        showIdleDrawableAnimation,
        showSelectedDrawableAnimation,
        titleLabelResizeAnimationY
    ]);

    /* Starts the selected-state animation. */
    marker.animationGroupSelected.start();
};


Marker.prototype.isAnyAnimationRunning = function (marker) {

    if (marker.animationGroupIdle === null || marker.animationGroupSelected === null) {
        return false;
    } else {
        return marker.animationGroupIdle.isRunning() === true || marker.animationGroupSelected.isRunning() === true;
    }
};

/* Will truncate all strings longer than given max-length "n". e.g. "foobar".trunc(3) -> "foo...". */
String.prototype.trunc = function (n) {
    return this.substr(0, n - 1) + (this.length > n ? '...' : '');
};