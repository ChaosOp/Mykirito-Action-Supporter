// ==UserScript==
// @name         Mykirito 純行動手練輔助器
// @namespace    http://tampermonkey.net/
// @version      3.2.5
// @description  防止手殘
// @author       ChaosOp
// @match        https://mykirito.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        unsafeWindow
// @require     https://github.com/ChaosOp/Mykirito-Action-Supporter/raw/master/setting_table.js?token=AMLS7PVXFLH2D4LT7LU35427B22LE
// @run-at document-idle
// ==/UserScript==

const set_button = [
  '自主訓練'
];

let added_count = [];
let added_disable = [];
let button_colle;
let path = "";
let pvp_path = "";

(async function() {
  'use strict';

  setInterval(function(){

    if(pvp_path != window.location.pathname){
      pvp_path = window.location.pathname;
      if( pvp_path.match(/\/profile\/*/) ) setTimeout(pvp_ready, 200);
    }

    if(path != window.location.pathname){
      path = window.location.pathname;
      if( path.match(/^\/$/) ) setTimeout(action_ready, 500);
    }

    if( !window.location.pathname.match(/\/profile\/*/) ) pvp_path = "";

    if( !window.location.pathname.match(/^\/$/) ){
      path = "";
      added_count = [];
      added_disable = [];
    }

    add_bar();

    if( window.location.pathname.match(/5edd45bd47bd0432d499b2cd/) ){
      let shino_link = document.getElementById("shino_link");
      shino_link.className = "sc-fznAgC dSEOxJ active";
    }
    else {
      let shino_link = document.getElementById("shino_link");
      shino_link.className = "sc-fznAgC dSEOxJ";
    }



  },500);

})();

async function add_bar() {
  let shino_link = document.getElementById("shino_link");

  let node = document.querySelector("div#root nav");
  let new_node = 0;

  new_node = document.createElement("a");

  if(!shino_link){
    new_node.className = "sc-fznAgC dSEOxJ";
    new_node.innerText = "Shino";
    new_node.id = "shino_link";
    new_node.href = "/profile/5edd45bd47bd0432d499b2cd";
    node.insertBefore(new_node, node.childNodes[7]);
  }

  shino_link = document.getElementById("shino_link");

}

async function pvp_ready() {

  button_colle = document.getElementsByClassName('sc-fznWOq cqDPIl');
  await add_listener(button_colle);
  await action_count_display(button_colle);

}

async function action_ready() {

  GM_setValue("level_now", parseInt(document.getElementsByClassName('sc-AxiKw eSbheu')[3].getElementsByClassName('sc-AxhUy dRdZbR')[0].innerText, 10) );

  if (GM_getValue("level_now") == 70) action_button = [];

  button_colle = document.getElementsByClassName("sc-AxgMl sc-fznZeY bbwYrD");
  await add_listener(button_colle);

  button_colle = document.getElementsByClassName("sc-AxgMl sc-fznZeY dyYxQJ");
  await add_listener(button_colle);

  button_colle = document.getElementsByClassName("sc-AxgMl kPlkaT");
  await add_listener(button_colle);
  await action_count_display(button_colle);

  button_colle = document.getElementsByClassName('sc-AxgMl llLWDd');
  await add_listener(button_colle);
  await action_count_display(button_colle);

  text_fix();
  if (!document.getElementById("exp_total")&!document.getElementById("action_select")) add_exp_bar();
  edit_exp_bar();
  get_total_exp();

}

async function edit_exp_bar(){

  let index = 3;
  if(window.location.pathname.match(/\/profile\/*/)) index = 2;

  let get_level = document.getElementsByClassName('sc-AxiKw eSbheu')[index];

  if(get_level.children[0].innerText == "等級") GM_setValue("level_now", parseInt(get_level.children[1].innerText, 10) );

  if(GM_getValue("level_now") == GM_getValue("level_next")) {

    GM_setValue("level_next", GM_getValue("level_now") + 1);

    total_action_count();

    console.log(`檢測到升級`);

    console.log(`目前等級${GM_getValue("level_now")}`);
    console.log(`下一等級${GM_getValue("level_next")}`);

    for(let i in set_button){
      GM_setValue(set_button[i], 0);
      console.log(`已重置${set_button[i]}次數`);
    }

    added_count = [];
    added_disable = [];

  }

  GM_setValue("level_next", GM_getValue("level_now") + 1);

  if (GM_getValue("level_now") == 70) action_button = [];

  let exp_now = document.getElementsByClassName('sc-AxhUy dRdZbR')[5].innerText.split("/")[0];
  let level_element = document.getElementsByClassName('sc-AxhUy dRdZbR')[5];

  if( !window.location.pathname.match(/\/profile\/*/) ) level_element.innerText = `${exp_now}/${levels[GM_getValue("level_next")]}（${levels[GM_getValue("level_next")]-exp_now}）`;
  level_element.style = "border-right-width: 1px";

  let exp_total = document.getElementById("exp_total");
  let action_select = document.getElementById("action_select");

}

async function add_exp_bar(){
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

    if(not_in_the_storage(GM_getValue(set_button[i]+"_count") ) ) GM_setValue(set_button[i]+"_count", 0);

    let action = document.createElement("input");
    action.id = set_button[i];
    action.value = GM_getValue(set_button[i]+"_count");
    action.style="width:60px";

    let action_name = document.createElement("label");
    action_name.innerText = set_button[i];

    action_select.appendChild(action_name);
    action_select.appendChild(action);
    action_select.appendChild(document.createElement("div"));

  }

  let confirm_button = document.createElement("button");

  confirm_button.innerText = "更改";
  confirm_button.onclick = get_total_exp;

  action_select.appendChild(confirm_button);

}

async function get_total_exp(){

  GM_setValue("total_exp_min", 0);
  GM_setValue("total_exp_max", 0);
  GM_setValue("total_exp_min_remain", 0);
  GM_setValue("total_exp_max_remain", 0);

  for (let i = 0; i < set_button.length; i ++){

    let action = document.getElementById(set_button[i]);

    GM_setValue(set_button[i]+"_count", action.value);
    if(not_in_the_storage(GM_getValue(set_button[i]+"_count") ) ) GM_setValue(set_button[i]+"_count", 0);
    let act_count = GM_getValue(set_button[i]+"_count");


    if(not_in_the_storage(GM_getValue(set_button[i]) ) ) GM_setValue(set_button[i], 0);
    let act_clicked_count = GM_getValue(set_button[i]);
    if (not_in_the_storage(act_clicked_count)) act_clicked_count = 0;

    let verify_exp = 10;
    if(pvp_button.includes(set_button[i])) verify_exp = 25;

    GM_setValue("total_exp_min", Math.floor( GM_getValue("total_exp_min") + actions_exp[set_button[i]].min * act_count + verify_exp * Math.floor(act_count / 17) ) );
    GM_setValue("total_exp_max", Math.floor( GM_getValue("total_exp_max") + actions_exp[set_button[i]].max * act_count + verify_exp * Math.floor(act_count / 17) ) );

    GM_setValue("total_exp_min_remain", Math.floor( GM_getValue("total_exp_min_remain") + actions_exp[set_button[i]].min * ( act_count - act_clicked_count ) + verify_exp * Math.floor( ( act_count - act_clicked_count ) / 17)) );
    GM_setValue("total_exp_max_remain", Math.floor( GM_getValue("total_exp_max_remain") + actions_exp[set_button[i]].max * ( act_count - act_clicked_count ) + verify_exp * Math.floor( ( act_count - act_clicked_count ) / 17)) );

    if(act_clicked_count >= act_count) {

      console.log(`${set_button[i]}已達目標次數`);

      button_colle = document.getElementsByClassName("sc-AxgMl kPlkaT");
      add_listener(button_colle);

      button_colle = document.getElementsByClassName("sc-AxgMl llLWDd");
      add_listener(button_colle);

    }

    button_colle = document.getElementsByClassName("sc-AxgMl kPlkaT");
    action_count_display(button_colle);

    button_colle = document.getElementsByClassName("sc-AxgMl llLWDd");
    action_count_display(button_colle);

  }

  edit_exp_bar();

  let exp_total = document.getElementById("exp_total");
  exp_total.innerText = `${GM_getValue("total_exp_min")}~${GM_getValue("total_exp_max")}（${GM_getValue("total_exp_min_remain")}~${GM_getValue("total_exp_max_remain")}）`;
  if(GM_getValue("total_exp_min")==GM_getValue("total_exp_max")) exp_total.innerText = `${GM_getValue("total_exp_min")}（${GM_getValue("total_exp_min_remain")}）`;

  console.log(`已重新計算經驗`);

}

async function action_count_display(button_colle){

  for (let i in button_colle){

    if (set_button.includes(button_colle[i].innerText)){
      let raw_text = button_colle[i].innerText.split("(")[0];
      if (not_in_the_storage(GM_getValue(raw_text) ) ) {
        GM_setValue(raw_text, 0);

        console.log(`reset ${raw_text} to ${GM_getValue(raw_text)}`);
      }
      let new_text = `${raw_text}(次數：${GM_getValue(raw_text)}/${GM_getValue(raw_text+"_count")})`;
      button_colle[i].innerText = new_text;
      console.log(`new_text`);
    }

  }

}

async function text_fix(){

  let boss_reward_cd = document.getElementsByClassName('sc-fzplWN hRBsWH')[2].children[1].innerText;
  document.getElementsByClassName('sc-fzplWN hRBsWH')[2].children[1].innerText = boss_reward_cd.replace("每 12 小時", "每 8 小時");

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

function add_listener(button_colle) {

  for (let i = 0; i < button_colle.length; i ++){

    let button_temp = button_colle[i].children[0];
    if (!button_temp) button_temp = button_colle[i];

    if (button_temp.parentNode.parentNode.style[0]) continue;
    if (button_temp.parentNode.style[0]) continue;

    let raw_text = button_temp.innerText.split("(")[0];

    if (action_button.includes(raw_text) || pvp_button.includes(raw_text)) {

      if ( set_button.includes(raw_text) ){

        if(!added_count.includes(raw_text)) {
          button_temp.addEventListener("click", () => action_count_add(button_temp));
          console.log(`計算按鈕已添加${raw_text}`);
          added_count.push(raw_text);
        }
        let act_count = GM_getValue(raw_text+"_count");
        let act_clicked_count = GM_getValue(raw_text);
        if(act_clicked_count >= act_count) {

          if(!added_disable.includes(raw_text)) {
            button_temp.addEventListener("mouseover", () => dis_button(button_temp, button_temp.className));
            console.log(`禁用按鈕已添加${raw_text}`);
            added_disable.push(raw_text);
          }

        }
        continue;
      }

      if(!added_disable.includes(raw_text)) {
        button_temp.addEventListener("mouseover", () => dis_button(button_temp, button_temp.className));
        console.log(`禁用按鈕已添加${raw_text}`);
        added_disable.push(raw_text);
      }

    }

  }

}

async function dis_button(button, classname) {

  button.disabled = true;
  button_change(button, enable_to_disable[classname]);

  action_count_display(button_colle);

  console.log(`${button.innerText} 按鈕已被關閉`);

}

async function button_change(button, class_name) {

  setTimeout(edit_exp_bar, 500);

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

async function action_count_add(button) {

  setTimeout(text_fix, 5000);

  let raw_text = button.innerText.split("(")[0];

  if(not_in_the_storage(GM_getValue(raw_text))) {
    GM_setValue(raw_text, 0);

    console.log(`reset ${raw_text} to ${GM_getValue(raw_text)}`);
  }

  setTimeout(edit_exp_bar, 500);
  setTimeout(get_total_exp, 500);

}

async function total_action_count(){

  let keys = GM_listValues();
  let values = [];
  let msg = "";

  keys.forEach(key => {
    console.log(key);
    if(set_button.includes(key)) {
      values.push(GM_getValue(key));
      GM_setValue(key, 0);
      GM_setValue(key+"_count", 0);
    }
  });

  for (let i = 0 ; i < keys.length ; i++){
    msg += `${keys[i]}:${values[i]},\n`;
  }
  console.log(msg);
}

function not_in_the_storage(item){
  return (item == NaN || item == undefined || item == null);
}
