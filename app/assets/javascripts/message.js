$(document).on('turbolinks:load', function() {
  $(function() {
    function buildHTML(message) {
      var content = message.content ? `${message.content}` : "";
      var img = message.image ? `<img src= ${message.image}>` : "";
      var html = `<div class="message" data-message_id="${message.id}">
                    <div class="message__upper-info">
                      <div class="message__upper-info__talker">
                        ${message.user_name}
                      </div>
                      <div class="message__upper-info__date">
                        ${message.date}
                      </div>
                    </div>
                    <div class="message__text">
                      <div class="message__text__content">
                        ${content}
                      </div>
                      ${img}
                    </div>
                  </div>`
      return html;
    };

    $('#new_message').on('submit', function(e) {
      e.preventDefault();
      var message = new FormData(this);
      var url = $(this).attr('action');

      $.ajax({
        url: url,
        type: "POST",
        data: message,
        dataType: 'json',
        processData: false,
        contentType: false
      })

      .done(function(data) {
        var html = buildHTML(data);
        $('.messages').append(html);
        $('.submit-btn').prop('disabled', false);
        $('#new_message')[0].reset();
        $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight});
      })

      .fail(function() {
        alert('メッセージの送信に失敗しました');
      })
    });

    var reloadMessages = function() {
      if (window.location.href.match(/\/groups\/\d+\/messages/)){
        var last_message_id = $('.message:last').data("message_id");
        $.ajax({
          url: 'api/messages',
          type: 'get',
          dataType: 'json',
          data: {id: last_message_id}
        })
        .done(function(messages) {
          var insertHTML='';
          messages.forEach(function(message){
            insertHTML = buildHTML(message);
            $('.messages').append(insertHTML);
          })
        })
        .fail(function() {
          alert("自動更新に失敗しました");
        })
      }
    };
    setInterval(reloadMessages, 5000);
  });
});