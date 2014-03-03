"use strict";

function Playlist(container) {
    this.container = container;
    this.tracks = [];
    this.state = "unknown";
    this.volume = 0;
    this.playing = -1;
}


Playlist.prototype.refresh = function () {
    var self = this;

    var track_container = this.container.find(".tracks");
    var volume_slider = this.container.find(".volume");

    track_container.empty();

    $(this.tracks).each(function (idx, track) {
        var elt = $('<li />');

        if (idx == self.playing) {
            elt.addClass('playing');
        }

        elt.text(track);
        track_container.append(elt);
    });


    volume_slider.css('width', this.volume + '%');
};


Playlist.prototype.update = function () {
    var self = this;
    $.getJSON("http://thweeble:7878/playlist",
              function (data) {
                  self.tracks = data.tracks
                  self.state = data.state;
                  self.volume = data.volume;
                  self.playing = data.playing;

                  self.refresh();
              });
};


$(function () {
    "use strict";

    var playlist = new Playlist($('#playlist-container'));

    playlist.update();

    setInterval(function () {
        playlist.update();
    }, 1000);
});
