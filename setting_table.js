const levels = {
    1:0,
    2:30,
    3:60,
    4:100,
    5:150,
    6:200,
    7:250,
    8:300,
    9:370,
    10:450,
    11:500,
    12:650,
    13:800,
    14:950,
    15:1200,
    16:1450,
    17:1700,
    18:1950,
    19:2200,
    20:2500,
    21:2800,
    22:3100,
    23:3400,
    24:3700,
    25:4000,
    26:4400,
    27:4800,
    28:5200,
    29:5600,
    30:6000,
    31:6500,
    32:7000,
    33:7500,
    34:8000,
    35:8500,
    36:9100,
    37:9700,
    38:10300,
    39:11000,
    40:11800,
    41:12600,
    42:13500,
    43:14400,
    44:15300,
    45:16200,
    46:17100,
    47:18000,
    48:19000,
    49:20000,
    50:21000,
    51:23000,
    52:25000,
    53:27000,
    54:29000,
    55:31000,
    56:33000,
    57:35000,
    58:37000,
    59:39000,
    60:41000,
    61:44000,
    62:47000,
    63:50000,
    64:53000,
    65:56000,
    66:59000,
    67:62000,
    68:65000,
    69:68000,
    70:71000,
    71:999999
}

const enable_to_disable = {
    "sc-AxgMl bPQSXu":"sc-AxgMl hLXMKY",
    "sc-AxgMl sc-fznZeY dyYxQJ":"sc-AxgMl kPlkaT",
    "sc-AxgMl llLWDd":"sc-AxgMl kPlkaT"
};

const actions_exp = {
    '狩獵兔肉':{"min":15,"max":19},
    '自主訓練':{"min":15,"max":15},
    '外出野餐':{"min":13,"max":19},
    '汁妹':{"min":18,"max":18},
    '做善事':{"min":18,"max":18},
    '坐下休息':{"min":15,"max":15},
    '釣魚':{"min":15,"max":15},
    '友好切磋':{"min":0,"max":0},
    '認真對決':{"min":0,"max":0},
    '決一死戰':{"min":0,"max":0},
    '我要超渡你':{"min":0,"max":0}
}

const pvp_button = [
    '我要超渡你',
    '決一死戰',
    '認真對決',
    //'友好切磋'
];

let action_button = [
    '領取獎勵',
    '狩獵兔肉',
    '自主訓練',
    '外出野餐',
    '汁妹',
    '做善事',
    '坐下休息',
    '釣魚'
];

let classname_colle = [
  "sc-AxgMl sc-fznZeY bbwYrD",
  "sc-AxgMl sc-fznZeY dyYxQJ",
  "sc-AxgMl kPlkaT",
  "sc-AxgMl llLWDd"
];

const bac_img_color = "linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 100%)";

const bac_img_url = "";

const css =
  "body{
    background-image:bac_img_color,url(bac_img_url)!important;
    background-attachment:fixed!important;
    background-position:center center!important;
    background-repeat:no-repeat!important;
    background-size:cover!important;
    background-color:rgba(45,45,45,1)!important;
    overflow-y:scroll}#root{color:#fff}:root{--th-bg-color:#f0f0f000!important;
    --th-bg-color-alt1:#f0f0f000!important;
    --primary-bg-color:#f0f0f000!important;
    --border-color:#dddddd54!important;
    --btn-bg-color-disabled:#e0e0e059!important;
    --input-bg-color:#e0e0e059!important;
    --btn-bg-color:#e0e0e059}.fYZyZu {color:#FFF}:root{--color:#FFF!important;
    --link-color:#7ea5ec!important;
    --report-color:#bbb!important;
    --report-special-color:#8198c1}.dSEOxJ.active{color:white!important;
    background:#00000000
  }";
