# 锐枫皮业网站（展会版）

给 Emir 用的静态站。品牌：锐枫皮业 / RUIFENG LEATHER。

路径（只在盒子上）：`/workspace/grokbot/锐枫网站建设Grok Bot版/`

**不要拷到 Mac。不要放进 OATH。不要 git push。**

上服务器：把 `dist/` 里所有文件上传即可。说明见 `dist/DEPLOY.txt`。

---

## 9月1日皮料展怎么用

1. 展台平板打开 `index.html`，或打开你服务器上的网址。
2. 设计师先看粒面（Togo / Swift / Epsom / 掌纹 / 摔纹 / 小纹 / 盒纹 / 大纹），再看色卡上的 **色号**。
3. 下单只认色号 `RF-xxxx`。名字可以改，号不能复用。
4. 屏幕色仅供参考，**以实物和色号为准**。实样在展会上看。
5. 中文加微信 `ruifeng-demo`；英文写 `hello@ruifengleather.com` 或填询价表。
6. 询价表只存在这台电脑的浏览器里，不会发信。展会现场直接说色号更快。
7. 没有购物车、没有结账、没有付款。页上的价是参考价。

ZH | EN 同一本目录。语言记在浏览器 `ruifeng-lang`。链接会带 `?lang=`，放在子目录也能换语言。

---

## 色号

`js/data.js` 里每个色有固定 `code`（例如金棕 RF-3001、干邑 RF-3002、大象灰 RF-2006）。**色号不复用、不要改号。**

号段：深色 RF-1xxx · 灰 RF-2xxx · 金棕 RF-3xxx · 浅 RF-4xxx · 红 RF-5xxx · 橙 RF-6xxx · 黄 RF-7xxx · 绿 RF-8xxx · 蓝 RF-9xxx · 粉 RF-11xx · 紫 RF-12xx。

色卡页 `colors.html`：色号写很大，适合展台平板。可按色系筛。点色块会进询价并带上色号。

---

## 部署

干净包在：

`/workspace/grokbot/锐枫网站建设Grok Bot版/dist/`

把 **dist 里所有文件** 上传到服务器网站根目录，或一个子目录（例如 GitHub Pages 的 `/ruifeng-leather/`）。

- 双击 `index.html` 能开。
- 放在子目录不用改文件。语言切换已经按完整路径写，不会跳到域名根上。
- Nginx 可参考：`try_files $uri $uri/ /index.html;`
- 子目录 Nginx：`try_files $uri $uri/ /你的目录/index.html;`
- `404.html` 会把人送回首页。

不要上传：`_参考_accio原版`、`img/_orig`、`tools`、`.git`、`node_modules`。

---

## 锁死的一句（首页 + 给设计师）

中文：法国小牛那一手感，给设计师的参考价

英文：Calf of that European hand, at a designer’s reference price.

不要改成折扣、百分比、营收。不要写「95%」、不要写「几个亿」。

---

## 私下参考（不要写上网站）

气质可以看法国小鞣厂 Tanneries Haas。只当情绪板，不是供货声明。

**给 Emir：** 粒面名是设计师常搜的手感对照，不是供货声明。**前台禁止写** 爱马仕、Hermès、Haas、哈斯、Barenia、Novonappa。Togo / Swift / Epsom 可以印。掌纹对外写「掌纹 / Palm grain」。

---

## 怎么双击打开

1. 打开本文件夹，或打开 `dist/`
2. 双击 `index.html`
3. Chrome / Edge / Safari
4. 不需要 Node，不需要命令，不需要先开服务器
5. 字体走 Google Fonts。没网会落到宋体 / 苹方

---

## 什么是假的（对照用，不是库存）

| 你看见的 | 实际 |
| --- | --- |
| 皮的名字、编号、厚度、幅宽 | 示例，不是厂里实时库存 |
| 参考价 xx 元/尺 和美元约价 | 量级，具体再谈 |
| `img/swatches/` 色块 | 生成的粒面色块，不是实拍色卡 |
| `img/atelier/` 厂图 | 占位图，不是锐枫实拍 |
| 微信号 `ruifeng-demo` | 先用着，以后换成真号 |
| 邮箱 `hello@ruifengleather.com` | 先用着，本站不会发信 |
| 询价表 | 只写在这台电脑，键名 `ruifeng-inquiries` |
| 认证、地址、客户名 | 没有。不要编 |

**没有购物车、没有结账、没有付款。**

---

## 八个粒面

| id | 中文 | 英文 | 图 |
| --- | --- | --- | --- |
| `togo` | Togo纹 | Togo | `img/grains/togo.jpg` |
| `swift` | Swift纹 | Swift | `img/grains/swift.jpg` |
| `epsom` | Epsom纹 | Epsom | `img/grains/epsom.jpg` |
| `clemence` | 掌纹 | Palm grain | `img/grains/clemence.jpg` |
| `tumbled` | 摔纹 | Tumbled | `img/grains/tumbled.jpg` |
| `lychee` | 小纹 | Fine pebble | `img/grains/lychee-small.jpg` |
| `box` | 光面盒纹 | Box calf | `img/atelier/box-calf.jpg` |
| `lychee-large` | 大纹 | Large pebble | **暂用小纹特写对照**，展会看实样。不要拿别人的大纹图来凑。 |

这些特写 Emir 喜欢，不要换成新画的图。

---

## 以后怎么换真图、真名

1. 粒面特写放 `img/grains/`，文件名不要改。大纹有了独立照片再放 `img/grains/lychee-large.jpg`，并改 `js/data.js` 里 `lychee-large` 的 `photo`，去掉 `photo_is_fallback`。
2. 改皮的名字和规格：`js/data.js` 的 `hides`。`category` 必须是上面八个 id 之一。`colors` 必须是 `colors` 里有的键，且 `img/swatches/<id>.jpg` 存在。
3. 换真色块：同名 jpg 放进 `img/swatches/`。色号 `code` 不要改。
4. 换微信 / 邮箱：`js/data.js` 顶部；页脚在每个 html；商品页微信卡读 `data.js` 的 `wechat`。
5. 不要加购物车。不要接支付。不要在页面写对标品牌。

重新生成占位色块（可选，盒子上）：`python3 tools/make_swatches.py`（只写 `img/swatches/`）。

---

## 页面

| 文件 | 干什么 |
| --- | --- |
| `index.html` | 首页：头图、锁死的一句、9月1日展会一行、粒面章节 |
| `catalog.html` | 皮料目录：按粒面筛，卡片是粒面图 + 色号 |
| `prints.html` | 粒面索引（和首页同一组，点进目录筛选） |
| `product.html` | 单张皮 `?id=rf-tg-01` |
| `colors.html` | 色卡，色号很大 |
| `about.html` | 广东厂、怎么要小样、下单按色号 |
| `inquiry.html` | 询价：色号 + 粒面必填，只存本机 |
| `404.html` | 找不到页，回首页 |
| `dist/` | 给服务器的干净拷贝 |

导航：首页 / 皮料目录 / 粒面 / 色卡 / 给设计师 / 询价寄样

---

## 还缺什么

- 大纹还没有独立特写（页上已标明用小纹对照）
- 真价、真库存、真微信号
- 工厂地址和证书（有再写）
- 真的寄样和邮件发送（本站故意不做）
