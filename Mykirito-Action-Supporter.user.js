// ==UserScript==
// @name         Mykirito 純行動手練輔助器
// @namespace    http://tampermonkey.net/
// @version      19.30.52
// @description  防止手殘
// @author       ChaosOp
// @match        https://mykirito.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @require      https://github.com/ChaosOp/Mykirito-Action-Supporter/raw/master/setting_table.js?token=AMLS7PVXFLH2D4LT7LU35427B22LE
// @run-at document-idle
// ==/UserScript==


//背景圖，預設關閉，請自行解除註解

// const background_color = "linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 100%)";
// const background_url = "https://i.imgur.com/M2UAj30.png";
//
// const css ="body{"
// +`background-image:${background_color},url(${background_url});`
// +"background-attachment:fixed;"
// +"background-position:center center;"
// +"background-repeat:no-repeat;"
// +"background-size:cover;"
// +"background-color:rgba(45,45,45,1);"
// +"}";

//背景圖，預設關閉，請自行解除註解



//設定保留哪些按鈕
const set_button =[
  '領取獎勵',
  "狩獵兔肉",
  "自主訓練",
  "外出野餐",
  "汁妹",
  "做善事",
  "坐下休息",
  "釣魚",
  '修行1小時',
  '修行2小時',
  '修行4小時',
  '修行8小時',
  '友好切磋'
];


let pvp_action_on = 1;
let added_count = [];
let added_disable = [];
let button_colle;
let path = "";
let pvp_path = "";
let reincarnation_path = "";


(async function() {
  'use strict';

  setInterval(function(){

    if( reincarnation_path != window.location.pathname){
      reincarnation_path = window.location.pathname;
      if (reincarnation_path.match(/reincarnation/)) setTimeout(optimize_button, 300);
    }

    if(pvp_path != window.location.pathname){
      pvp_path = window.location.pathname;
      if( pvp_path.match(/\/profile\/*/) ) setTimeout(pvp_ready, 200);
      // GM_addStyle(css);
    }

    if(path != window.location.pathname){
      path = window.location.pathname;
      if( path.match(/^\/$/) ) setTimeout(action_ready, 400);
      // GM_addStyle(css);
    }

    if( !window.location.pathname.match(/\/profile\/*/) ) pvp_path = "";

    if( !window.location.pathname.match(/reincarnation/) ) reincarnation_path = "";

    if( !window.location.pathname.match(/^\/$/) ){
      path = "";
      added_count = [];
      added_disable = [];
    }

  },500);

})();

async function optimize_button(){
  let button = document.getElementsByClassName("sc-AxgMl cTNLKJ")[0];
  if(button) dis_button(button, button.className);
}

async function pvp_ready() {

  button_colle = await document.getElementsByClassName('sc-fznWOq cqDPIl');
  await add_listener(button_colle);
  await display_action_count(button_colle);

  if(pvp_action_on) {
    add_listener_default();
    display_action_count_default();
  }

}

async function action_ready() {

  GM_setValue("level_now", parseInt(document.getElementsByClassName('sc-AxiKw eSbheu')[3].getElementsByClassName('sc-AxhUy dRdZbR')[0].innerText, 10) );

  if (GM_getValue("level_now") == 70) action_button = [];

  add_listener_default();
  display_action_count_default();

  text_fix();
  if (!document.getElementById("exp_total")&!document.getElementById("action_select")) add_action_count_bar();
  setTimeout(get_total_exp, 200);
  setTimeout(edit_exp_bar, 800);
  // add_menu();

}

async function edit_exp_bar(){

  if(window.location.pathname.match(/\/profile\/*/)) return;

  let get_level = document.getElementsByClassName('sc-AxhUy dRdZbR')[4].innerText;

  GM_setValue("level_now", parseInt(get_level, 10) );

  check_level_up();
  display_action_count_default();

  GM_setValue("level_next", GM_getValue("level_now") + 1);

  if (GM_getValue("level_now") == 70) action_button = [];

  let exp_now = document.getElementsByClassName('sc-AxhUy dRdZbR')[5].innerText.split("/")[0];
  let level_element = document.getElementsByClassName('sc-AxhUy dRdZbR')[5];

  let this_level = `${exp_now}/${levels[GM_getValue("level_next")]}（${levels[GM_getValue("level_next")]-exp_now}）`;
  let next_level = `（${levels[GM_getValue("level_next")+1]-levels[GM_getValue("level_next")]}）`;

  level_element.innerText = `${this_level}${next_level}`;
  level_element.width = "1";

  console.log(`已更新升級所需經驗值：${level_element.innerText}`);

}

async function add_action_count_bar(){
  let exp_total = document.getElementById("exp_total");
  let action_select = document.getElementById("action_select");
  let node = document.querySelector("div#root table > tbody");
  let new_node = 0;

  new_node = node.lastChild.cloneNode(true);

  if(!exp_total){
    new_node.childNodes[0].innerText = "行動所需\n經驗總和";
    new_node.childNodes[1].id = "exp_total";
  }

  if(!action_select){
    new_node.childNodes[2].innerText = "行動搭配";
    new_node.childNodes[3].id = "action_select";
  }

  node.appendChild(new_node);

  exp_total = document.getElementById("exp_total");
  action_select = document.getElementById("action_select");

  exp_total.innerText = 0;
  action_select.innerText = "";

  for (let i = 0; i < set_button.length; i ++){

    if(practice_button.includes(set_button[i])) continue;

    if(not_exist(GM_getValue(set_button[i]+"_count") ) ) GM_setValue(set_button[i]+"_count", 0);

    let action = document.createElement("input");
    action.id = set_button[i]+"_count";
    action.value = GM_getValue(set_button[i]+"_count");
    action.style="width:60px";

    let action_name = document.createElement("label");
    action_name.innerText = set_button[i];
    while (action_name.innerText.length != 4) action_name.innerText += "　";

    action_select.appendChild(action_name);
    action_select.appendChild(action);
    action_select.appendChild(document.createElement("div"));

  }

  let confirm_button = document.createElement("button");

  confirm_button.innerText = "更改";
  confirm_button.id = "change";
  confirm_button.addEventListener("click", get_total_exp, false);
  confirm_button.addEventListener("click", edit_exp_bar, false);

  let reload_handler = () => setTimeout( () => window.location.reload(), 300);
  confirm_button.addEventListener("click", reload_handler, false);

  action_select.appendChild(confirm_button);

}

// async function add_menu(){
//   let menu_button = document.querySelector('#menu_button');
//   let node = document.querySelector("nav");
//
//   if(!menu_button){
//     menu_button = document.createElement("a");
//     menu_button.className = "sc-fznAgC dSEOxJ";
//     menu_button.id = "menu_button";
//     menu_button.innerText = "Option";
//     node.insertBefore(menu_button, node.lastChild);
//
//     let button = tippy(document.querySelector('#menu_button'));
//
//     button.setProps({
//       allowHTML: true,
//       interactive: true,
//       delay:500,
//       onTrigger(button, mouseover) {
//         slide(button);
//       },
//       onUntrigger(button, mouseout){
//         reset_set_button();
//         button.setContent("");
//       }
//
//     });
//
//   }
//
//
//   async function slide(button){
//
//     for (let i = 1; i < 8; i++){
//
//       let next_content = `<input type="checkbox" name="check_action" id=${action_button[i]} ${set_button.includes(action_button[i])?"checked":""}>${action_button[i]}<br>`;
//       await setTimeout(() => button.setContent(button.props.content+next_content), i*65);
//
//     }
//
//   }
//
//   async function reset_set_button(){
//     set_button = [];
//     let checkbox_colle = document.getElementsByName('check_action');
//
//     for (let i in checkbox_colle){
//       if(checkbox_colle[i].checked) {
//         set_button = GM_getValue("set_button");
//         set_button.push(checkbox_colle[i].id);
//       }
//     }
//     GM_setValue("set_button", set_button);
//
//   }
//
//
// }

async function get_total_exp(){

  if(window.location.pathname.match(/\/profile\/*/)) return;

  GM_setValue("total_exp_min", 0);
  GM_setValue("total_exp_max", 0);
  GM_setValue("total_exp_min_remain", 0);
  GM_setValue("total_exp_max_remain", 0);

  let total_count = 0;
  let total_count_clicked = 0;
  let total_verify_exp = 0;

  for (let i = 0; i < set_button.length; i ++){

    if(practice_button.includes(set_button[i])) continue;

    let action = document.getElementById(set_button[i]+"_count");

    GM_setValue(set_button[i]+"_count", parseInt(action.value));
    if(not_exist(GM_getValue(set_button[i]+"_count") ) ) GM_setValue(set_button[i]+"_count", 0);
    let act_count = GM_getValue(set_button[i]+"_count");


    if(not_exist(GM_getValue(set_button[i]) ) ) GM_setValue(set_button[i], 0);
    let act_clicked_count = GM_getValue(set_button[i]);
    if (not_exist(act_clicked_count)) act_clicked_count = 0;

    GM_setValue("total_exp_min", GM_getValue("total_exp_min") + actions_exp[set_button[i]].min * act_count );
    GM_setValue("total_exp_max", GM_getValue("total_exp_max") + actions_exp[set_button[i]].max * act_count );

    GM_setValue("total_exp_min_remain", GM_getValue("total_exp_min_remain") + actions_exp[set_button[i]].min * ( act_count - act_clicked_count ) );
    GM_setValue("total_exp_max_remain", GM_getValue("total_exp_max_remain") + actions_exp[set_button[i]].max * ( act_count - act_clicked_count ) );

    total_count += act_count;
    total_count_clicked += act_clicked_count;
    if(pvp_button.includes(set_button[i])) total_verify_exp += 25;
    else total_verify_exp += 10;

  }

  let average_verify_exp =  Math.floor(total_verify_exp / set_button.length);

  GM_setValue("total_exp_min", GM_getValue("total_exp_min") + average_verify_exp * Math.floor(total_count / 22) );
  GM_setValue("total_exp_max", GM_getValue("total_exp_max") + average_verify_exp * Math.floor(total_count / 22) );

  GM_setValue("total_exp_min_remain", GM_getValue("total_exp_min_remain") + average_verify_exp * Math.floor( ( total_count - total_count_clicked ) / 22) );
  GM_setValue("total_exp_max_remain", GM_getValue("total_exp_max_remain") + average_verify_exp * Math.floor( ( total_count - total_count_clicked ) / 22) );


  add_listener_default();
  display_action_count_default();

  let exp_total = document.getElementById("exp_total");
  exp_total.innerText = `${GM_getValue("total_exp_min")}~${GM_getValue("total_exp_max")}（${GM_getValue("total_exp_min_remain")}~${GM_getValue("total_exp_max_remain")}）`;
  if(GM_getValue("total_exp_min")==GM_getValue("total_exp_max")) exp_total.innerText = `${GM_getValue("total_exp_min")}（${GM_getValue("total_exp_min_remain")}）`;

  // console.log(`已重新計算經驗`);

}

async function display_action_count(button_colle){

  // if( window.location.pathname.match(/\/profile\/*/) ) return;

  for (let i in button_colle){
    if(check_if_display(button_colle[i])) continue;

    let raw_text = button_colle[i].innerText.split("(")[0];

    if (set_button.includes(raw_text) && !practice_button.includes(raw_text)){
      if (not_exist(GM_getValue(raw_text) ) ) {
        GM_setValue(raw_text, 0);
      }

      let new_text = `${raw_text}(次數：${GM_getValue(raw_text)}/${GM_getValue(raw_text+"_count")})`;
      if (GM_getValue(raw_text+"_count")==0) new_text = raw_text;
      button_colle[i].innerText = new_text;
    }

  }

}

async function text_fix(){

  let boss_reward_cd = document.getElementsByClassName('sc-fzplWN hRBsWH')[2].children[1].innerText;
  if (boss_reward_cd.includes("每 12 小時")) {
    document.getElementsByClassName('sc-fzplWN hRBsWH')[2].children[1].innerText = boss_reward_cd.replace("每 12 小時", "每 4 小時");
  }


  //let action_cd = document.getElementsByClassName('sc-fzplWN hRBsWH')[3].children[1].innerText;
  //if(action_cd.includes("CD")) {
  //  document.getElementsByClassName('sc-fzplWN hRBsWH')[3].children[1].innerText = action_cd.replace("CD為100秒", "CD為80秒");
  //  let fixed_cd_text = document.createElement("div");
  //  fixed_cd_text.innerText = action_cd.replace("CD為100秒", "CD為80秒");
  //  if(action_cd.includes("CD")) document.getElementsByClassName('sc-fzplWN hRBsWH')[3].children[1].appendNode(fixed_cd_text);

  //  setInterval( ()=>{
  //     document.getElementsByClassName('sc-fzplWN hRBsWH')[3].children[2].innerText = document.getElementsByClassName('sc-fzplWN hRBsWH')[3].children[1].innerText.replace("CD為100秒", "CD為80秒");
  //}, 1000);

  //}



}

async function add_listener(button_colle) {

  for (let i = 0; i < button_colle.length; i ++){

    let button_temp = button_colle[i].children[0];
    if (!button_temp) button_temp = button_colle[i];

    if (check_if_display(button_temp)) continue;

    let raw_text = button_temp.innerText.split("(")[0];

    if (action_button.includes(raw_text) || pvp_button.includes(raw_text)) {

      if ( set_button.includes(raw_text) ){

        if(!added_count.includes(raw_text)) {

          let action_delay = 1000;

          if(practice_button.includes(raw_text)) action_delay = 3000;

          let count_handler = () => setTimeout(add_action_count, action_delay, button_temp);
          button_temp.addEventListener("click", count_handler, false);
          // console.log(`計算按鈕已添加${raw_text}`);
          added_count.push(raw_text);
        }

        let act_count = GM_getValue(raw_text+"_count");
        let act_clicked_count = GM_getValue(raw_text);

        if(act_clicked_count >= act_count) {

          if(!added_disable.includes(raw_text)) {
            let dis_handler = () => dis_button(button_temp, button_temp.className);
            button_temp.addEventListener("mouseover", dis_handler, false);
            // console.log(`禁用按鈕已添加${raw_text}`);
            added_disable.push(raw_text);
          }

        }
        continue;
      }

      if(!added_disable.includes(raw_text)) {
        let dis_handler = () => dis_button(button_temp, button_temp.className);
        button_temp.addEventListener("mouseover", dis_handler, false);
        // console.log(`禁用按鈕已添加${raw_text}`);
        added_disable.push(raw_text);
      }

    }

  }

}

async function dis_button(button, classname) {

  button.disabled = true;
  change_button(button, enable_to_disable[classname]);

  // console.log(`${button.innerText} 按鈕已被關閉`);

}

async function change_button(button, class_name) {

  button.className = class_name;

  button.style.marginTop = "12px";
  button.style.marginRight = "4px";
  button.style.marginBottom = "12px";
  button.style.marginLeft = "0px";

  if( pvp_path.match(/\/profile\/*/) ) button.style.marginRight = "12px";

  button.style.paddingTop = "8px";
  button.style.paddingRight = "20px";
  button.style.paddingBottom = "8px";
  button.style.paddingLeft = "20px";

}

async function add_action_count(button) {

  let raw_text = button.innerText.split("(")[0];

  if(!record_action()) return;

  if(not_exist(GM_getValue(raw_text)) && !practice_button.includes(raw_text)) {
    GM_setValue(raw_text, 0);
    console.log(`reset ${raw_text} to ${GM_getValue(raw_text)}`);
  }

  if (!practice_button.includes(raw_text)) GM_setValue(raw_text, GM_getValue(raw_text) + 1);

  setTimeout(get_total_exp, 200);
  setTimeout(edit_exp_bar, 800);

}

function not_exist(item){
  return (item == NaN || item == undefined || item == null && item != 0);
}

function check_if_display(button){
  if(!button.parentNode) return 1;
  else if(button.parentNode.style[0]) return 1;
  else if(button.parentNode.parentNode.style[0]) return 1;
}

function check_level_up(){
  if(GM_getValue("level_now") >= GM_getValue("level_next")) {

    GM_setValue("level_next", GM_getValue("level_now") + 1);

    console.log(`檢測到升級`);
    console.log(`下一等級${GM_getValue("level_next")}`);

    for(let i in set_button){

      if(practice_button.includes(set_button[i])) continue;
      if(GM_getValue(set_button[i])==0) continue;

      console.log(`${set_button[i]}總次數為${GM_getValue(set_button[i])}`);
      GM_setValue(set_button[i], 0);
      console.log(`已重置${set_button[i]}次數`);
    }

    added_count = [];
    added_disable = [];

    window.location.reload();

  }

}

function record_action(){
  let last_action = document.getElementsByClassName("sc-fznKkj fQkkzS");

  if(last_action.item(0)){

    console.log(last_action[0].innerText);
    if(last_action[0].innerText.includes("還在冷卻中")) {
      let handler = () => window.location.reload();
      setTimeout(handler, 400);
      return 0;
    }

  }
  return 1;
}

async function display_action_count_default(){

  button_colle = await document.getElementsByClassName('sc-AxgMl');
  await display_action_count(button_colle);

}

async function add_listener_default(){

  button_colle = await document.getElementsByClassName('sc-AxgMl');
  await add_listener(button_colle);

}
