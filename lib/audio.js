/**
 * @class AudioManager
 * @param _game
 * @return
 */
function AudioManager(_game) {

	this.audioTracks = new Array();
	this.game = _game;
	this.muted = false;

	var myAudio = document.createElement('audio');
	this.canPlayMp3 = "" != myAudio.canPlayType('audio/mpeg');
	this.canPlayOgg = "" != myAudio.canPlayType('audio/ogg; codecs="vorbis"');

	this.loadingStatus = function() {

		var total = 0;
		var countReady = 0;

		for (key in this.audioTracks) {
			total++;
			var audio = this.audioTracks[key];

			this.game.debug.warn(key + ' audio state : ' + audio.readyState);
			if (audio.readyState >= audio.HAVE_CURRENT_DATA) {
				countReady++;
			}
		}

		if (countReady == 0) {
			return 0;
		}

		return countReady / total;
	};

	/*
	 * register audio sources
	 */
	this.register = function(_name, _loop) {

		if (!this.audioTracks[_name]) {

			var myLocalAudio = new Audio('');

			if (_loop) {
				myLocalAudio.loop = _loop;
				myLocalAudio.addEventListener('ended', function() {
					this.currentTime = 0;
				}, false);
			}

			myLocalAudio.autoplay = false;

			var source = false;
			if (this.canPlayMp3) {
				source = _name + '.mp3';
			} else {
				if (this.canPlayOgg) {
					source = _name + '.ogg';
				}
			}

			if (source) {
				myLocalAudio.src = source;
				myLocalAudio.load();
				this.audioTracks[_name] = myLocalAudio;
			} else {
				this.game.debug
						.warn('browser not able to play MP3 or OGG');
			}

		}
	};

	this.play = function(_name) {
		if (this.audioTracks[_name]) {
			var audio = this.audioTracks[_name];
			if (audio.isFlash) {
				audio.playFlash(audio.src);
			} else {
				audio.play();
			}

		} else {
			this.game.debug.warn('audio :' + _name + ' not registered');
		}
	};

	this.pause = function(_name) {
		if (this.audioTracks[_name]) {
			var audio = this.audioTracks[_name];
			audio.pause();
		} else {
			this.game.debug.warn('audio :' + _name + ' not registered');
		}
	};

	this.mute = function() {
		this.muted = true;
		for (key in this.audioTracks) {
			var audio = this.audioTracks[key];
			audio.muted = true;
		}
	};

	this.unmute = function() {
		this.muted = false;
		for (key in this.audioTracks) {
			var audio = this.audioTracks[key];
			audio.muted = false;
		}
	};

	this.setVolume = function(_volume) {
		for (key in this.audioTracks) {
			var audio = this.audioTracks[key];
			audio.volume = _volume;
		}
	};

}
