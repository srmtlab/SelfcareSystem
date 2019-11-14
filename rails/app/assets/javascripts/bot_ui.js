
$(function(){
    //処理
    var botui = new BotUI('hello-world');
var char_name = "タロウ";
var user_name = "ようた"
botui.message.bot({

    delay: 1500,
    content: 'はじめまして！'
});
botui.message.bot({
    delay: 4000,
    content: 'おいらの名前は' + char_name
});
botui.message.bot({
    delay: 6000,
    content: 'これから'+　user_name + 'をサポートしていくから仲良くしておくれ！'
});
botui.message.bot({
    delay: 8000,
    content: 'いきなりなんだけれど質問をしてもいいかな？'
});
botui.message.bot({
    delay: 10000,
    content: '一日に何食食べてるの？'
}).then(function(){

    botui.action.button ({

        delay: 1000,
        action: [{

            text: '3食',
            value: '3食'
        }, {
            text: '2食',
            value: '2食'
        }, {
            text: '1食',
            value: '1食'
        },{
            text: '食べない',
            value: '食べない'
        }]
    }).then(function(res){

        if(res.value == '3食'){

            botui.message.bot({
            delay: 1000,
            content: 'しっかりと食事できてるね'
            });
            botui.message.bot({
                delay: 2000,
                content: 'ちなみに僕は一日5食だよ'
            });
        }else{
            botui.message.bot({
                delay: 1000,
                content: 'それはダメだよ！'
            });
            botui.message.bot({
                delay: 1000,
                content: '食事を3食とるのは大切だよ'
            });
        }
    }).then(function(){
        botui.message.bot({
            delay: 3000,
            content: '今日は朝ごはん何食べた？'
        });
    }).then(function(){
        botui.action.text ({
            delay: 4000,
            action:{
                placeholder: 'Your name'
            }
        }).then(function(res){
            botui.message.add({
                content: res.value
            });
        });
     });
});

function postForm(value) {
 
    var form = document.createElement('form');
    var request = document.createElement('input');
 
    form.method = 'POST';
    form.action = 'https://httpbin.org/post';
 
    request.type = 'hidden'; //入力フォームが表示されないように
    request.name = 'text';
    request.value = value;
 
    form.appendChild(request);
    document.body.appendChild(form);
 
    form.submit();
 
}
  
  });

