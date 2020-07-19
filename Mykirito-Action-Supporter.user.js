// ==UserScript==
// @name         Mykirito 純行動手練輔助器
// @namespace    http://tampermonkey.net/
// @version      17.9.13.11
// @description  防止手殘
// @author       ChaosOp
// @match        https://mykirito.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        unsafeWindow
// @require      https://github.com/ChaosOp/Mykirito-Action-Supporter/raw/master/setting_table.js?token=AMLS7PVXFLH2D4LT7LU35427B22LE
// @require      https://unpkg.com/@popperjs/core@2
// @require      https://unpkg.com/tippy.js@6
// @run-at document-idle
// ==/UserScript==

let set_button = GM_getValue("set_button", ["自主訓練", "狩獵兔肉"]);

let added_count = [];
let added_disable = [];
let button_colle;
let path = "";
let pvp_path = "";
let handlers = {"count_handler":[],"dis_handler":[]};

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

  },500);

})();

async function pvp_ready() {

  button_colle = await document.getElementsByClassName('sc-fznWOq cqDPIl');
  await add_listener(button_colle);
  await display_action_count(button_colle);

}

async function action_ready() {

  GM_setValue("level_now", parseInt(document.getElementsByClassName('sc-AxiKw eSbheu')[3].getElementsByClassName('sc-AxhUy dRdZbR')[0].innerText, 10) );

  if (GM_getValue("level_now") == 70) action_button = [];

  add_listener_default();
  display_action_count_default();

  text_fix();
  if (!document.getElementById("exp_total")&!document.getElementById("action_select")) add_action_count_bar();
  edit_exp_bar();
  get_total_exp();
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

  level_element.innerText = `${exp_now}/${levels[GM_getValue("level_next")]}（${levels[GM_getValue("level_next")]-exp_now}）`;
  level_element.style = "border-right-width: 1px";

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

    if(not_exist(GM_getValue(set_button[i]+"_count") ) ) GM_setValue(set_button[i]+"_count", 0);

    let action = document.createElement("input");
    action.id = set_button[i]+"_count";
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
  confirm_button.addEventListener("click", edit_exp_bar );
  confirm_button.addEventListener("click", get_total_exp );

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

  GM_setValue("total_exp_min", 0);
  GM_setValue("total_exp_max", 0);
  GM_setValue("total_exp_min_remain", 0);
  GM_setValue("total_exp_max_remain", 0);

  for (let i = 0; i < set_button.length; i ++){

    let action = document.getElementById(set_button[i]+"_count");

    GM_setValue(set_button[i]+"_count", action.value);
    if(not_exist(GM_getValue(set_button[i]+"_count") ) ) GM_setValue(set_button[i]+"_count", 0);
    let act_count = GM_getValue(set_button[i]+"_count");


    if(not_exist(GM_getValue(set_button[i]) ) ) GM_setValue(set_button[i], 0);
    let act_clicked_count = GM_getValue(set_button[i]);
    if (not_exist(act_clicked_count)) act_clicked_count = 0;

    let verify_exp = 10;
    if(pvp_button.includes(set_button[i])) verify_exp = 25;

    GM_setValue("total_exp_min", Math.floor( GM_getValue("total_exp_min") + actions_exp[set_button[i]].min * act_count + verify_exp * Math.floor(act_count / 17) ) );
    GM_setValue("total_exp_max", Math.floor( GM_getValue("total_exp_max") + actions_exp[set_button[i]].max * act_count + verify_exp * Math.floor(act_count / 17) ) );

    GM_setValue("total_exp_min_remain", Math.floor( GM_getValue("total_exp_min_remain") + actions_exp[set_button[i]].min * ( act_count - act_clicked_count ) + verify_exp * Math.floor( ( act_count - act_clicked_count ) / 17)) );
    GM_setValue("total_exp_max_remain", Math.floor( GM_getValue("total_exp_max_remain") + actions_exp[set_button[i]].max * ( act_count - act_clicked_count ) + verify_exp * Math.floor( ( act_count - act_clicked_count ) / 17)) );

  }

  add_listener_default();
  display_action_count_default();

  let exp_total = document.getElementById("exp_total");
  exp_total.innerText = `${GM_getValue("total_exp_min")}~${GM_getValue("total_exp_max")}（${GM_getValue("total_exp_min_remain")}~${GM_getValue("total_exp_max_remain")}）`;
  if(GM_getValue("total_exp_min")==GM_getValue("total_exp_max")) exp_total.innerText = `${GM_getValue("total_exp_min")}（${GM_getValue("total_exp_min_remain")}）`;

  console.log(`已重新計算經驗`);

}

async function display_action_count(button_colle){

  if( window.location.pathname.match(/\/profile\/*/) ) return;

  for (let i in button_colle){
    if(check_if_display(button_colle[i])) continue;

    let raw_text = button_colle[i].innerText.split("(")[0];

    if (set_button.includes(raw_text)){
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
  boss_reward_cd = boss_reward_cd.replace("每 12 小時", "每 8 小時");

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
          let count_handler = () => add_action_count(button_temp);
          handlers.count_handler.push(count_handler);
          button_temp.addEventListener("click", count_handler, false);
          // console.log(`計算按鈕已添加${raw_text}`);
          added_count.push(raw_text);
        }
        let act_count = GM_getValue(raw_text+"_count");
        let act_clicked_count = GM_getValue(raw_text);
        if(act_clicked_count >= act_count) {

          if(!added_disable.includes(raw_text)) {
            let dis_handler = () => dis_button(button_temp, button_temp.className);
            handlers.dis_handler.push(dis_handler);
            button_temp.addEventListener("mouseover", dis_handler, false);
            // console.log(`禁用按鈕已添加${raw_text}`);
            added_disable.push(raw_text);
          }

        }
        continue;
      }

      if(!added_disable.includes(raw_text)) {
        let dis_handler = () => dis_button(button_temp, button_temp.className);
        handlers.dis_handler.push(dis_handler);
        button_temp.addEventListener("mouseover", dis_handler, false);
        // console.log(`禁用按鈕已添加${raw_text}`);
        added_disable.push(raw_text);
      }

    }

  }

}

async function clear_listener(button_colle) {
  for (let i = 0; i < button_colle.length; i ++){

    let button_temp = button_colle[i].children[0];
    if (!button_temp) button_temp = button_colle[i];

    if (check_if_display(button_temp)) continue;

    let raw_text = button_temp.innerText.split("(")[0];

    if ( set_button.includes(raw_text) ){

      for (let j in handlers.count_handler){
        let count_handler = handlers.count_handler[j];
        button_temp.removeEventListener("click", count_handler, false);
      }
      // console.log(`計算按鈕已移除${raw_text}`);
    }

    for (let j in handlers.dis_handler){
      let dis_handler = handlers.dis_handler[j];
      button_temp.removeEventListener("mouseover", dis_handler, false);
    }
    // console.log(`禁用按鈕已移除${raw_text}`);

  }

  handlers = {"count_handler":[],"dis_handler":[]};

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

  if(not_exist(GM_getValue(raw_text))) {
    GM_setValue(raw_text, 0);
    console.log(`reset ${raw_text} to ${GM_getValue(raw_text)}`);
  }

  GM_setValue(raw_text, GM_getValue(raw_text) + 1);

  setTimeout(get_total_exp, 200);
  setTimeout(edit_exp_bar, 700);

}

function not_exist(item){
  return (item == NaN || item == undefined || item == null && item != 0);
}

function check_if_display(button){
  if(!button.parentNode) return 1;
  else if(button.parentNode.style[0]) return 1;
  else if(button.parentNode.parentNode.style[0]) return 1;
}

async function check_level_up(){
  if(GM_getValue("level_now") == GM_getValue("level_next")) {

    GM_setValue("level_next", GM_getValue("level_now") + 1);

    console.log(`檢測到升級`);
    console.log(`下一等級${GM_getValue("level_next")}`);

    for(let i in set_button){
      GM_setValue(set_button[i], 0);
      console.log(`已重置${set_button[i]}次數`);
    }

    for(let i in classname_colle){
      button_colle = await document.getElementsByClassName(classname_colle[i]);
      await clear_listener(button_colle);
    }

    added_count = [];
    added_disable = [];

    action_ready();

  }
}

async function display_action_count_default(){

  for(let i in classname_colle){
    button_colle = await document.getElementsByClassName(classname_colle[i]);
    await display_action_count(button_colle);
  }

}

async function add_listener_default(){

  for(let i in classname_colle){
    button_colle = await document.getElementsByClassName(classname_colle[i]);
    await add_listener(button_colle);
  }

}
