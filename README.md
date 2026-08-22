# 锐枫皮业 · Grok Bot 版

这不是网店。双击就能打开，用来看「以后真站大概长什么样」。

路径（只在盒子上）：`/workspace/grokbot/锐枫网站建设Grok Bot版/`

不要拷到 Mac。不要放进 OATH 文件夹。没有 git。

---

## 现在的方向（小牛皮鞣厂）

锐枫皮业 / RUIFENG LEATHER：广东**小**鞣厂，专做**小牛皮料**，卖给独立设计师品牌（包袋、鞋、小皮件）。气质像设计师鞣厂：疏、大、少字。不要做成厚街出口厂或 1688 格子站。

两件必须一眼看见的事：

1. **皮的质感** — 整张皮、粒面特写，用 `img/atelier/` 里的大图。
2. **性价比** — 同一档小牛手感，页上只写更友好的「参考价 / from (reference)」。

受众是独立设计师品牌（月采购大概在十万到百万这个量级）。**这些金额不要印上网站。**

---

## 锁死的一句（首页 + 给设计师）

中文：法国小牛那一手感，给设计师的参考价

英文：Calf of that European hand, at a designer’s reference price.

这是性价比的公开说法。不要改成折扣、百分比、营收或采购额。不要写「95%」、不要写「几个亿」。

---

## 私下参考（不要写上网站）

气质可以看法国小鞣厂 Tanneries Haas：https://www.tanneries-haas.com/

只当情绪板，不是供货声明，也不是同厂。

**给 Emir：** 首页和目录的粒面（Togo / Swift / Epsom / 掌纹 / 摔纹 / 小纹 / 盒纹 / 大纹）对应设计师常问的那一组豪华屋粒面（Hermès-family grains：Togo、Swift、Epsom、Clémence 等）。这是检索名和手感对照，不是供货声明。**前台页面禁止写** 爱马仕、Hermès、Haas、哈斯、Barenia。Togo / Swift / Epsom 可以印在站上——设计师就这么搜。掌纹对外写「掌纹 / Palm grain」，不要写 Clémence。

**站点上禁止出现：** Haas、哈斯、Hermès、爱马仕、Barenia、Novonappa、「95%」、营收「几个亿」、采购额数字。不要写假认证、假门牌、假客户。

---

## 怎么双击打开

1. 打开文件夹 `锐枫网站建设Grok Bot版`
2. 双击 `index.html`
3. 用 Chrome / Edge / Safari 打开即可
4. 不需要安装 Node，不需要输入命令，不需要开服务器
5. 字体走 Google Fonts（Playfair Display + Noto Sans SC）。没网时会落到宋体 / 苹方，版式还在

点上面的 **ZH | EN** 可以整站换中英文。选择存在浏览器的 `ruifeng-lang` 里。链接上也会带 `?lang=`，换页一般不丢。

---

## Accio 原版在哪

单页原版没有改，仍在：

`_参考_accio原版/index.html`

那是 Accio 做的一页。Grok Bot 版把同一套纸色 / 墨色 / 字标拆成可点的多页站，并拿掉未核实的句子和热链图。不要改那个文件夹。

---

## 什么是假的（全部是占位）

| 你看见的 | 实际 |
| --- | --- |
| 皮的名字、编号、厚度、幅宽 | 编的示例，不是厂里库存 |
| 「参考价 xx 元/尺」和美元约价 | 编的量级，具体再谈 |
| `img/swatches/` 色块 | Python PIL 画的粒面色块，不是实拍色卡 |
| `img/atelier/` 四张厂图 | 已放：hero-hide / box-calf / veg-calf / grain-calf。仍是占位图，不是锐枫实拍 |
| 微信号 `ruifeng-demo` | 示例，加了也没人回 |
| 邮箱 `hello@ruifengleather.com` | 示例，不会发信 |
| 询价表提交 | 只写在这台电脑的浏览器里，键名 `ruifeng-inquiries` |
| 认证、地址、客户名 | 没有。不要编 |

顶上那条浅色细字：图与价为占位。

**没有购物车、没有结账、没有付款。**

---

## 八个粒面（首页章节 = 目录筛选）

设计师一打开首页就看见这些粒面。旧的盒纹/树膏/双鞣分类已换掉。

| id | 中文 | 英文 | 优先图 | 缺了退回 |
| --- | --- | --- | --- | --- |
| `togo` | Togo纹 | Togo | `img/grains/togo.png` | `img/atelier/grain-calf.png` |
| `swift` | Swift纹 | Swift | `img/grains/swift.png` | `img/atelier/box-calf.png` |
| `epsom` | Epsom纹 | Epsom | `img/grains/epsom.png` | `img/atelier/grain-calf.png` |
| `clemence` | 掌纹 | Palm grain | `img/grains/clemence.png` | `img/atelier/grain-calf.png` |
| `tumbled` | 摔纹 | Tumbled | `img/grains/tumbled.png` | `img/atelier/veg-calf.png` |
| `lychee` | 小纹 | Fine pebble | `img/grains/lychee-small.png` | `img/atelier/grain-calf.png` |
| `box` | 光面盒纹 | Box calf | `img/atelier/box-calf.png` | 同左 / 色块 |
| `lychee-large` | 大纹 | Large pebble | `img/grains/lychee-small.png` | `img/atelier/grain-calf.png` |

首页头图：`img/atelier/hero-hide.png`（已放，缺了退回 `img/hero.jpg`）。

给设计师页肖像 / 首页简介竖图：`img/atelier/box-calf.png`。

首页章节和目录卡片优先 `img/grains/` 特写；文件还没放到盒子上时，退回 atelier 再退回色块，不会白屏。

目录里 19 条示例 SKU，全部是小牛，全部是示例。参考价。每条示例皮带 4–6 个核心色（Noir / Gold / Etoupe / Cognac / Craie / Navy），仍是示例。

---

## 色卡（固定色号）

`js/data.js` 的 `colors` 现有 51 个设计师鞣厂常用色。每个色有固定 `code`（金棕 RF-3001、干邑 RF-3002、大象灰 RF-2006）。**色号不复用。** 名字以后可以改；同一个号永远只代表这一色。

色系（前台筛选）：深色 / 灰色 / 金棕 / 红色 / 橙色 / 黄色 / 绿色 / 蓝色 / 粉色 / 紫色 / 浅色。

号段：深色 RF-1xxx · 灰 RF-2xxx · 金棕 RF-3xxx · 浅 RF-4xxx · 红 RF-5xxx · 橙 RF-6xxx · 黄 RF-7xxx · 绿 RF-8xxx · 蓝 RF-9xxx · 粉 RF-11xx · 紫 RF-12xx。

- 色卡页 `colors.html`：大色块，色号最大，下面中英名，可按色系筛。页上写：屏幕色仅供参考，以实物和色号为准。
- 商品页：每张皮的颜色写出色号 + 名字。询价表色号必填。
- `img/swatches/<id>.png` 是 PIL 粒面色块，不是实拍。重新生成：`python3 tools/make_swatches.py`（只写 `img/swatches/`，不碰 `img/grains/` 和 `img/atelier/`）。
- 每种粒面列 4–6 个常备色（Noir / Gold / Etoupe / Cognac / Craie / Navy），仍是示例。

## 以后怎么换真图、真名

1. **换厂里的大图（最重要）**  
   粒面特写放进 `img/grains/`，文件名用下面这些，首页章节和目录卡已经在指它们：
   - `togo.png` / `swift.png` / `epsom.png` / `clemence.png` / `tumbled.png` / `lychee-small.png`
   - 可选：`box.png` / `lychee-large.png`
   整张皮 / 头图仍放 `img/atelier/`：
   - `hero-hide.png` — 首页全屏头图（整张皮）
   - `box-calf.png` / `veg-calf.png` / `grain-calf.png`（粒面缺图时的退回）
   - 建议：暗一点的宽图，好叠白字。放进去即生效，不用改代码。

2. **换皮的名字和规格**  
   打开 `js/data.js`，改 `hides` 数组。每个皮有：
   - `id`（链接用，比如 `rf-bx-01`）
   - `name_zh` / `name_en`
   - `category`（必须是：`togo` `swift` `epsom` `clemence` `tumbled` `lychee` `box` `lychee-large` 之一）
   - `thickness_mm`、`width_cm`
   - `price_cny_per_sqft`、`price_usd_per_sqft`（仍然建议标参考价）
   - `colors`（对应下面色卡文件名，不带 `.png`）
   - 中英的鞣法、手感、用途说明

3. **换真皮色块**  
   把厂里的照片放进 `img/swatches/`，文件名跟 `colors` 里的键一致，例如 `oxblood.png`。  
   色卡页用这些 png（不是纯 CSS 色块）。卡片会自动用该系列厂图（有的话），颜色用圆点标。  
   **色号是下单依据。** 名字可以改，`code`（RF-xxxx）不能复用、不要改号。

4. **加一种新颜色**  
   在 `js/data.js` 的 `colors` 里加一项：`zh` `en` `hex` `family` `code`（新色号，不复用）。再放一张同名 png。

5. **重新生成占位色块（可选）**  
   盒子上：`python3 tools/make_swatches.py`  
   脚本读 `js/data.js` 里每一色，画粒面 png 到 `img/swatches/`。加 `--all` 才会重画 hero / about / paper / favicon。

6. **换微信 / 邮箱**  
   `js/data.js` 顶部的 `wechat`、`email`；页脚在每个 html 底部；商品页微信卡在 `js/site.js`。

7. **还不要做的事**  
   不要加购物车。不要接支付。不要写成「现货商城」。真要收询价，再单独接表单服务。不要在页面上写对标品牌名。不要把 Haas 的网址或名字印上前台。

---

## 页面一览

| 文件 | 干什么 |
| --- | --- |
| `index.html` | 首页：全屏皮面、锁死的一句、简介竖图、八个粒面章节、看皮→寄样→谈价 |
| `catalog.html` | 皮料目录：粒面大图 + 名字 + 厚度 + 参考价，可按粒面筛选 |
| `product.html` | 单张皮，地址栏 `?id=rf-bx-01`，系列皮面 + 安静规格表 |
| `colors.html` | 色卡：按色系筛选的大色块墙，色号写很大，中英名在下 |
| `about.html` | 给设计师：锁死的一句、盒纹肖像、怎么寄样 |
| `inquiry.html` | 询价表（色号必填），只存本机 |
| `css/site.css` | 纸色 / 墨色 / 更大字距 |
| `js/data.js` | 皮的数据 + 51 色色卡（每色有色号） |
| `js/site.js` | 语言、筛选、详情、表单、厂图回退 |
| `img/grains/` | 粒面特写（首页章节 / 目录卡优先） |
| `img/atelier/` | 头图和退回厂图（四张已放） |
| `_参考_accio原版/` | Accio 单页原版，未改 |

导航：首页 / 皮料目录 / 色卡 / 给设计师 / 询价寄样

语言键：`ruifeng-lang`。询价键：`ruifeng-inquiries`。商品页仍用 `product.html?id=`。中英仍用 `.lang-zh` / `.lang-en`。

---

## 现在还缺什么（以后补）

- 其余粒面特写若还没拷到 `img/grains/`，站点会先退回 atelier
- 真名、真厚度、真价、真微信号
- 工厂地址和证书（有再写，没有就空着）
- 真的寄样和邮件发送（本站故意不做）
