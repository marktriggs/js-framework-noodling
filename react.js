/** @jsx React.DOM */

var Playlist = React.createClass({
    getInitialState: function() {
        return {playlist: {}};
    },
    fetchPlaylist: function () {
        var self = this;
        $.getJSON("http://thweeble:7878/playlist",
                  function (data) {
                      self.setState({playlist: data})
                  })
    },
    componentWillMount: function () {
        this.fetchPlaylist();
        setInterval(this.fetchPlaylist, 1000);
    },
    render: function() {
        return (
            <div>
              <TrackList playing={this.state.playlist.playing} tracks={this.state.playlist.tracks} />
              <Volume level={this.state.playlist.volume} />
            </div>
        );
    }
});


var TrackList = React.createClass({
    render: function() {
        var trackList = [];

        if (this.props.tracks) {
            var playing = this.props.playing;

            trackList = this.props.tracks.map(function (track, i) {
                var elt = <li key={track}>{track}</li>;

                if (i == playing) {
                    elt.props.className = 'playing';
                }

                return elt;
            });
        }

        return (
            <ul className="tracks">{trackList}</ul>
        );
    }
});


var Volume = React.createClass({
    render: function() {
        return <div className="volume-container"><div className="volume" style={{width: this.props.level + '%'}}></div></div>
    }
});


React.renderComponent(
    <Playlist />,
    document.getElementById('playlist-container')
);
