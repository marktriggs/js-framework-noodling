YUI().use(['app', 'model', 'handlebars'], function (Y) {

    Y.PlaylistModel = Y.Base.create('playlistModel', Y.Model, [], {
        refresh: function (complete) {
            var self = this;

            Y.io('http://thweeble:7878/playlist', {
                method: 'GET',
                on: {
                    success: function (id, result) {
                        var json = Y.JSON.parse(result.responseText);
                        self.set('volume', json.volume);
                        self.get('tracks').reset(json.tracks.map(function (track, i) {
                            return {
                                track: track,
                                isPlaying: i == json.playing
                            };
                        }));

                        complete(self);
                    }
                }
            });
        }
    }, {
        ATTRS: {
            volume: {},
            playing: {},
            tracks: {value: new Y.ModelList()},
        }
    });


    var playlistView = new Y.View({
        container: Y.one('#playlist-container'),
	template: Y.Handlebars.compile(Y.one('#playlist-template').getHTML()),
    });


    playlistView.render = function (playlist) {
        this.get('container').setHTML(this.template({tracks: playlist.get('tracks').toJSON(),
                                                     playing: playlist.get('playing'),
                                                     volume: playlist.get('volume')
                                                    }));
    };


    var app = new Y.App({
        playlist: new Y.PlaylistModel()
    });

    app.route('*', function () {
        this.get('playlist').refresh(function (playlist) {
            playlistView.render(playlist);
        });
    });

    app.render().dispatch();
});
