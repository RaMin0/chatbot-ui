var Message = function(arg) {
  this.text = arg.text;
  this.messageSide = arg.messageSide;
  this.draw = function(self) {
    return function() {
      var $message = $($('.message-template').clone().html());
      $message.addClass(self.messageSide).find('.text .content').html(self.text);
      $('.messages').append($message);
      $message.addClass('appeared');
    };
  }(this);

  return this;
};

function appendMessage(text, messageSide) {
  if (!text || text.trim() === '') {
    return;
  }
  
  var message = new Message({
    text: text,
    messageSide: messageSide
  });
  message.draw();

  var $messages = $('.messages');
  $messages.animate({
    scrollTop: $messages.prop('scrollHeight')
  }, 300);
};

function getURL(path) {
  var url = $('.title a').text().trim();

  if (!url.match(/^https?:\/\//)) {
    url = 'http://' + url;
  }

  if (!url.match(/\/$/)) {
    url += '/'
  }

  if (path) {
    url += path;
  }

  return url;
}

function getUUID() {
  return $('.uuid code').text().trim();
}

function handleError(xhr, textStatus, errorThrown) {
  appendMessage(xhr.responseText || 'Oops! Something went wrong.', 'error');
}

function sendWelcome() {
  $('.messages').html('');
  $('.message-input').focus();

  setTimeout(function() {
    $.ajax(getURL('welcome'), { 
      success: function(data) {
        $('.uuid code').html(data.uuid);
        appendMessage(data.message, 'left');
      },
      error: handleError
    });
  }, 100);
}

function sendChat(message) {
  $.ajax(getURL('chat'), {
    method: 'POST',
    headers: { authorization: getUUID() },
    contentType: 'application/json',
    data: JSON.stringify({ message: message, }),
    success: function(data) {
      appendMessage(data.message, 'left');
    },
    error: handleError
  });
}

$('.send-message').click(function(e) {
  var $messageInput = $('.message-input');
  var message = $messageInput.val()
  if (message && message.trim() !== "") {
    appendMessage(message, 'right');
    sendChat(message);
  }
  $messageInput.val('');
  $messageInput.focus();
});

$('.message-input').keyup(function(e) {
  if (e.which === 13) {
    $('.send-message').click();
  }
});

$('.title a').editable({
  defaultValue: getURL(),
  emptyclass: null,
  emptytext: getURL(),
  inputclass: 'input-lg',
  onblur: 'submit',
  placement: 'bottom',
  savenochange: true,
  showbuttons: false,
  success: sendWelcome,
  unsavedclass: null,
});

sendWelcome();
