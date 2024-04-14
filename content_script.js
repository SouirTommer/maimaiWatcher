var controlsEnabled = true;

function createButton(text, onClick) {
  var button = document.createElement('button');
  button.style.border = 'none';
  button.style.outline = 'none';
  button.textContent = text;
  button.style.background = 'rgba(0, 0, 0, 0.5)';
  button.style.color = 'rgba(255, 255, 255, 0.5)';
  button.style.padding = '7px';
  button.style.borderRadius = '5px';
  button.style.margin = '5px 5px 5px 5px';
  button.style.cursor = 'grab';
  button.addEventListener('click', function(event) {
    event.stopPropagation();
    onClick(event);
  });

  return button;
}


function addControls(videoPlayer) {
  var controlsContainer = document.createElement('div');
  controlsContainer.id = 'ControlsContainer';
  controlsContainer.style.position = 'absolute';
  controlsContainer.style.zIndex = '9999';
  controlsContainer.style.top = '50px';
  controlsContainer.style.right = '10px';
  controlsContainer.style.display = 'none';

  var toggleButton = createButton('<', function() {
    // Toggle the display of the other buttons
    var buttons = controlsContainer.querySelectorAll('button:not(:first-child)');
    var isExtended = buttons[0].style.display !== 'none';
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].style.display = isExtended ? 'none' : '';
    }
  });
  controlsContainer.appendChild(toggleButton);

  var horizontalMirrorButton = createButton('⇿', function() {
    videoPlayer.style.transform = videoPlayer.style.transform === 'scaleX(-1)' ? '' : 'scaleX(-1)';
  });
  controlsContainer.appendChild(horizontalMirrorButton);

  var verticalMirrorButton = createButton('↕', function() {
    videoPlayer.style.transform = videoPlayer.style.transform === 'scaleY(-1)' ? '' : 'scaleY(-1)';
  });
  controlsContainer.appendChild(verticalMirrorButton);

  var rotate180Button = createButton('⟲', function() {
    videoPlayer.style.transform = videoPlayer.style.transform === 'rotate(180deg)' ? '' : 'rotate(180deg)';
  });
  controlsContainer.appendChild(rotate180Button);

  horizontalMirrorButton.style.display = 'none';
  verticalMirrorButton.style.display = 'none';
  rotate180Button.style.display = 'none';

  var videoContainer = videoPlayer.parentElement;
  videoContainer.style.position = 'relative';
  videoContainer.appendChild(controlsContainer);


  document.addEventListener('fullscreenchange', function() {
    if (document.fullscreenElement) {
      controlsContainer.style.display = 'none';
    } else {
      controlsContainer.style.display = 'block';
    }
  });

  videoContainer.addEventListener('mouseenter', function() {
    controlsContainer.style.display = 'block';
  });

  videoContainer.addEventListener('mouseleave', function() {
    controlsContainer.style.display = 'none';
    var buttons = controlsContainer.querySelectorAll('button:not(:first-child)');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].style.display = 'none';
    }
  });
}

function removeControls() {
  var controlsContainer = document.querySelector('#ControlsContainer');
  if (controlsContainer) {
    console.log('Removing controls');
    controlsContainer.parentElement.removeChild(controlsContainer);
  }
}

window.addEventListener('load', function() {
  var videoPlayer = document.querySelector('video');
  
  if (videoPlayer && controlsEnabled) {
    addControls(videoPlayer);
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'toggleControls') {
    
    controlsEnabled = !controlsEnabled;
    var videoPlayer = document.querySelector('video');
    if (controlsEnabled) {
      addControls(videoPlayer);
      console.log('Controls enabled');
    } else {
      removeControls();
      console.log('Controls disabled');
    }
  }
});