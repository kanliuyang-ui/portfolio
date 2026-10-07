/*
	作品集中英双语切换
	- 中文为默认语言（页面 DOM 本身即中文）
	- 英文通过字典（键 = 归一化后的中文 innerHTML）整体替换
	- 选择持久化到 localStorage，全站 6 页生效
	- 只替换叶子级文本元素的 innerHTML，不移除任何带事件的容器节点
*/
(function () {
	'use strict';

	var DICT = {

		/* ---------- 全站导航 / 页脚 ---------- */
		'作品集': `Portfolio`,
		'涟漪': `Ripple`,
		'贪婪': `Greed`,
		'刀歌': `Blade Song`,
		'设计模板: <a href="https://html5up.net">HTML5 UP</a>': `Template: <a href="https://html5up.net">HTML5 UP</a>`,

		/* ---------- 首页 index.html ---------- */
		'精选项目': `Projects`,
		'作品集 · 5 个游戏项目': `Portfolio · 5 game projects`,
		'<a href="projects.html">作品集<br> PORTFOLIO</a>': `<a href="projects.html">Portfolio<br> SELECTED WORKS</a>`,
		'从 VR 恐怖叙事到 UE5 桌面模拟，五个独立完成的完整游戏项目——每个项目均附完整设计文档。':
			`From VR horror narrative to a UE5 desktop simulation — five complete, independently built game projects, each with a full design document.`,
		'<a href="projects.html" class="button large">进入作品集</a>': `<a href="projects.html" class="button large">View portfolio</a>`,
		'PORTFOLIO · 五个独立项目': `PORTFOLIO · five independent projects`,
		'作品集<br> PORTFOLIO': `Portfolio<br> SELECTED WORKS`,
		'五个独立完成的游戏项目——从叙事驱动到系统驱动，覆盖 VR、2D、3D 与桌面模拟。每个项目均可查看完整设计文档。':
			`Five complete, independently built game projects — from narrative-driven to systems-driven, spanning VR, 2D, 3D, and desktop simulation. Every project opens with a full design document.`,
		'技能': `Skills`,
		'联系': `Contact`,
		'你好，<br> 我是 Yannis': `Hi, I'm<br> Yannis`,
		'游戏开发者 · Unity / Unreal Engine / AI 辅助开发<br> 用游戏探讨严肃议题 —— 网络暴力、偏见与贪婪。':
			`Game developer · Unity / Unreal Engine / AI-assisted workflows<br> I make games about serious topics — online harassment, prejudice, and greed.`,
		'<a href="#header" class="button icon solid solo fa-arrow-down scrolly">继续</a>':
			`<a href="#header" class="button icon solid solo fa-arrow-down scrolly">Continue</a>`,
		'UE 5.8 · 桌面模拟叙事': `UE 5.8 · Desktop-simulation narrative`,
		'<a href="ripple.html">涟漪<br> RIPPLE</a>': `<a href="ripple.html">Ripple<br> RIPPLE</a>`,
		'"Every word you type lands on someone else\'s screen."<br> 网络暴力题材第一人称桌面模拟叙事游戏：玩家在电脑前搜集线索、发表言论，随时切换到被网暴者 / 施暴者 / 旁观者的屏幕 —— 亲眼看到你打下的每一个字，落在别人屏幕上是什么样子。':
			`"Every word you type lands on someone else's screen."<br> A first-person desktop-simulation narrative game about cyberbullying: from your own computer you gather clues and post comments — then flip to the screens of the victim, the harassers, and the bystanders, and watch exactly how every word you typed lands on someone else.`,
		'网络暴力题材第一人称桌面模拟叙事游戏：在你自己的电脑前搜集线索、发表言论，用 ←/→ 键切换到其他人的屏幕——亲眼看到你的每一句话，落在别人屏幕上是什么样子。':
			`A first-person desktop-simulation narrative game about cyberbullying: from your own computer you gather clues and post comments — then flip to other people's screens and watch exactly how every sentence you send lands on someone else.`,
		'第一章完整可玩（30–35 分钟）：开场、三波次推进、发言结算、强制阅读演出与数字结算，32 项 PIE 自动化回归通过':
			`Chapter 1 fully playable (30–35 minutes): opening, three waves, comment scoring, a forced-reading scene, and numeric settlement — verified by 32 automated PIE regression checks`,
		'五设备叙事：←/→ 切换被网暴者 / 施暴者 / 旁观者的屏幕，5 个平台级 App 内容互通':
			`Five-device narrative: ←/→ switches to the victim's, harassers', and bystanders' screens; 5 platform-level apps share one content universe`,
		'设计支柱：每个字都有重量 · 屏幕即人物 · 无人是纯粹的恶人 · 不可撤回':
			`Design pillars: every word carries weight · the screen is the character · no one is purely evil · nothing can be unsaid`,
		'美术采用 Tripo AI 生成 + 人工修型的「玩具剧场」低模风格；场景、蓝图、UI 与数据管线全部由本人独立完成，开发全程用 ADR 决策记录与自动化回归管理质量。':
			`Art direction: a "toy theatre" low-poly style generated with Tripo AI and hand-retouched. Scenes, blueprints, UI, and the data pipeline were all built by myself, with ADR decision records and automated regression testing governing quality throughout development.`,
		'<a href="ripple.html" class="button">查看详情</a>': `<a href="ripple.html" class="button">Details</a>`,
		'Unity 2022 · 2D 像素': `Unity 2022 · 2D Pixel`,
		'Unity 6 · 2D 横板': `Unity 6 · 2D Side-scroller`,
		'<a href="goodkid.html">Good Kid<br> VR 弃屋探险</a>': `<a href="goodkid.html">Good Kid<br> VR Abandoned-House Adventure</a>`,
		'<a href="greed.html">贪婪<br> GREED</a>': `<a href="greed.html">Greed<br> GREED</a>`,
		'<a href="daoge.html">刀歌<br> MANAGE &amp; FIGHT</a>': `<a href="daoge.html">Blade Song<br> MANAGE &amp; FIGHT</a>`,
		'<a href="rpg.html">2D 像素 RPG<br> 暂定名</a>': `<a href="rpg.html">2D Pixel RPG<br> untitled</a>`,
		'第一人称 VR 恐怖叙事：在废弃房屋中探索，操作门、抽屉、灯具与日常物品，在看似平常的家庭规则下度过一晚又一晚 —— 有些规则是假的。':
			`First-person VR horror narrative: explore an abandoned house, operating doors, drawers, lamps, and everyday objects — and live through night after night under seemingly ordinary family rules. Some of those rules are lies.`,
		'规则违规系统：4 条家庭规则中混有 1 条假规则，违规触发灯闪、黑雾演出': `Rule-violation system: 4 family rules with 1 fake mixed in; violations trigger flickering lights and fog events`,
		'敲门事件与怪物追捕：限时躲藏失败即被追捕，抓到重置当天': `Knock-at-the-door events and monster pursuit: fail to hide in time and you are hunted; getting caught resets the day`,
		'门 / 抽屉 / 柜门 / 灯全物理交互（XR Interaction Toolkit + OpenXR）': `Fully physical interaction with doors / drawers / cabinets / lamps (XR Interaction Toolkit + OpenXR)`,
		'<a href="goodkid.html" class="button">查看详情</a>': `<a href="goodkid.html" class="button">Details</a>`,
		'末日起于人类对永生的贪婪 ——「永生药剂」失控引发尸变。核心机制「贪婪负担」：拿得越多，走得越慢、打得越慢；最终 BOSS 对高贪婪玩家索取额外伤害。':
			`The apocalypse began with humanity's greed for immortality — a failed "elixir of life" triggered the outbreak. Core mechanic, Greed Burden: the more you carry, the slower you move and shoot; and the final BOSS deals extra damage to greedy players.`,
		'独立完成「灰烬高塔」关卡：三层实验室 + 地下 BOSS 房，239 件建造件全封闭灰盒':
			`Solo-built "Ashen Spire" level: a three-floor laboratory plus underground BOSS room, fully enclosed grey-box of 239 pieces`,
		'LDD 关卡设计文档：动线流程 / 剖面 / 光照节奏（冷白 → 半明半暗 → 过曝纯白）':
			`LDD level design document: flow / section / lighting rhythm (cold white → half-lit → overexposed white)`,
		'丧尸 AI 行为树（巡逻 / 发现 / 追击）与武器、拾取系统': `Zombie AI behavior trees (patrol / detect / chase) plus weapon and loot systems`,
		'<a href="greed.html" class="button">查看详情</a>': `<a href="greed.html" class="button">Details</a>`,
		'铁匠铺经营 × 回合制战斗 × 地图探索三合一 —— 白天打铁卖武器，攒够装备出门讨伐。':
			`Blacksmith management × turn-based combat × map exploration: forge and sell weapons by day, gear up and head out on expeditions.`,
		'锻造系统：加热 / 锻造 / 组装三工位全链路拖拽，热力值 FSM 驱动': `Forging: heat / forge / assemble stations with full drag-and-drop flow, driven by heat-value FSMs`,
		'经营循环：顾客流与特殊订单、3×4 库存柜、稀有度定价': `Shop loop: customer traffic and special orders, a 3×4 storage cabinet, rarity-based pricing`,
		'7×7 地图探索：时间制移动、事件 / 战斗 / 村庄地块、固定种子跨天继承':
			`7×7 map exploration: time-based movement, event / battle / village tiles, fixed-seed persistence across days`,
		'<a href="daoge.html" class="button">查看详情</a>': `<a href="daoge.html" class="button">Details</a>`,
		'立意「偏见」：受神赐福的勇者开局碾压魔物，中途视角反转成魔物求生，最终揭露神才是幕后黑手。':
			`Theme: prejudice. A hero blessed by god stomps monsters — until the perspective flips and you survive as the monster, uncovering god as the true villain.`,
		'血条即叙事：魔物「不配显示血条」，魔王「血条打不死」—— 同一手法，相反含义':
			`Health bars as narrative: monsters get no bar ("not worth measuring") while the demon king's bar never drops — the same device, opposite meanings`,
		'双旗标 × 4 结局体系：神像与隐藏房间决定 奖励 / 上坟 / 轮回 / 世界和平':
			`Two flags × 4 endings: the god statue and the hidden room decide Reward / Grave / Rebirth / Peace`,
		'完整动作平台框架：角色控制器、8 类怪物 AI、摔落结算、像素级水陷阱':
			`Complete action-platformer framework: character controller, 8 monster AI types, fall-damage resolution, pixel-precise water hazards`,
		'<a href="rpg.html" class="button">查看详情</a>': `<a href="rpg.html" class="button">Details</a>`,
		'关于我': `About me`,
		'机制即叙事<br> DESIGN PHILOSOPHY': `Mechanics as Narrative<br> DESIGN PHILOSOPHY`,
		'我是一名专注于<strong>叙事与机制设计</strong>的独立游戏开发者。独立完成多个 Unity 与 Unreal Engine 项目，覆盖 VR 探险、2D 像素 RPG、第一人称 3D 与桌面模拟叙事等多种形态；作品聚焦严肃议题的游戏化表达 —— 网络暴力、偏见、贪婪 —— 相信机制本身就可以是叙事。':
			`I am an indie game developer focused on <strong>narrative and mechanics design</strong>. I have independently shipped multiple Unity and Unreal Engine projects spanning VR adventure, 2D pixel RPG, first-person 3D, and desktop-simulation narrative. My work explores serious topics through gameplay — online harassment, prejudice, greed — out of the belief that mechanics themselves can be narrative.`,
		'同时深度实践 AI 协作开发工作流：以「需求 → ADR 决策记录 → 实现 → 自动化回归验证」的流程与 AI 结对开发，并使用 ComfyUI 与 Tripo 构建 AI 美术管线。所有项目的设计文档、决策记录与开发日志全程留档、可追溯。':
			`I also work deeply with AI-assisted development: pairing with AI through a "requirements → ADR decision record → implementation → automated regression" workflow, and building AI art pipelines with ComfyUI and Tripo. Every project keeps its design documents, decision records, and dev logs on file — fully traceable.`,
		'技能栈': `Skills`,
		'工具箱<br> TOOLBOX': `Toolbox<br> TOOLBOX`,
		'引擎与平台': `Engines & Platforms`,
		'编程语言': `Languages`,
		'AI 工具链': `AI Toolchain`,
		'设计能力': `Design Skills`,
		'Unity（2022 LTS · Unity 6）': `Unity (2022 LTS · Unity 6)`,
		'VR：XR Interaction Toolkit + OpenXR': `VR: XR Interaction Toolkit + OpenXR`,
		'UE 蓝图（全蓝图项目实践）': `UE Blueprints (shipped blueprint-only projects)`,
		'JavaScript / Node.js': `JavaScript / Node.js`,
		'Python（引擎编辑器自动化）': `Python (engine editor automation)`,
		'ComfyUI 图像工作流': `ComfyUI image workflows`,
		'Tripo 3D 生成与人工修型': `Tripo 3D generation with hand retouching`,
		'AI 结对开发（需求 → ADR → 实现 → 回归）': `AI pair development (requirements → ADR → implementation → regression)`,
		'叙事与文案设计': `Narrative & writing`,
		'关卡设计（LDD / 灰盒 / 光照节奏）': `Level design (LDD / grey-box / lighting rhythm)`,
		'系统与数值设计': `Systems & numerical design`,
		'自动化回归测试（PIE 验收）': `Automated regression testing (PIE acceptance)`,
		'关于': `About`,
		'正在寻找研究生阶段继续深耕游戏设计与开发的机会。<br> 如果我的作品让你感兴趣，欢迎联系。':
			`I am looking for a graduate program to keep deepening my work in game design and development.<br> If my work interests you, please get in touch.`,
		'邮箱': `Email`,
		'社交': `Social`,

		/* ---------- 涟漪 ripple.html ---------- */
		'旗舰项目 · UE 5.8 全蓝图 · 桌面模拟叙事': `Flagship · UE 5.8 Blueprint-only · Desktop-simulation narrative`,
		'涟漪<br> RIPPLE': `Ripple<br> RIPPLE`,
		'"Every word you type lands on someone else\'s screen."<br> 网络暴力题材第一人称桌面模拟叙事游戏：玩家面对一台电脑搜集线索、发表言论，用 ←/→ 键切换到被网暴者 / 施暴者 / 中立者的设备——<strong>亲眼看到你的每一句话，落在别人屏幕上是什么样子</strong>。':
			`"Every word you type lands on someone else's screen."<br> A first-person desktop-simulation narrative game about cyberbullying: you sit at one computer, gather clues, post comments — and with the ←/→ keys you switch to the devices of the victim, the harassers, and the bystanders, <strong>watching exactly how every sentence you send lands on someone else's screen</strong>.`,
		'设计概念': `Design concept`,
		'网暴的道德重量来自「发言者看不到受害者的屏幕」。传统叙事游戏（Orwell、全网公敌）让玩家当监控者或旁观者；《涟漪》把这种信息不对称直接翻转成交互机制——<strong>玩家必须是参与者</strong>。每一次发言都是博弈：热度、立场、证据、措辞，全部会被对面的屏幕如实接收。':
			`The moral weight of online harassment comes from the speaker never seeing the victim's screen. Traditional narrative games (Orwell, Do Not Feed the Monkeys-like watchers) cast the player as a monitor or bystander; Ripple flips that information asymmetry directly into its core interaction — <strong>the player must be a participant</strong>. Every post is a gamble: heat, stance, evidence, wording — all of it is faithfully received by the screen on the other side.`,
		'由此闭环出本作的核心循环：': `This closes the loop into the game's core cycle:`,
		'侦查（搜集证据）→ 发言（唯一武器）→ 切屏看涟漪（←/→ 切换设备）→ 世界更新（旧发言继续发酵）':
			`Investigate (gather evidence) → Speak (your only weapon) → Switch screens to see the ripple (←/→) → The world updates (old posts keep fermenting)`,
		'设计支柱': `Design pillars`,
		'<strong>每个字都有重量</strong>——发言是唯一的武器，也是唯一的责任来源': `<strong>Every word carries weight</strong> — speech is your only weapon, and your only source of responsibility`,
		'<strong>屏幕即人物</strong>——全作无角色立绘，壁纸 / 图标 / 通知音就是人物侧写': `<strong>The screen is the character</strong> — no character art anywhere; wallpapers / icons / notification sounds are the portraits`,
		'<strong>无人是纯粹的恶人</strong>——施暴者也在自己的生活里，立场由处境而非标签决定': `<strong>No one is purely evil</strong> — harassers have lives of their own; stances come from circumstances, not labels`,
		'<strong>不可撤回</strong>——删评无效，截图早已扩散；互联网没有橡皮擦': `<strong>Nothing can be unsaid</strong> — deleting a comment is useless; the screenshots already spread. The internet has no eraser`,
		'<strong>不适但克制</strong>——语义施压写法，无脏话、无真实人脸，用不适感而非猎奇': `<strong>Uncomfortable but restrained</strong> — semantic pressure instead of slurs, no real faces; discomfort over spectacle`,
		'核心机制：设备切换': `Core mechanic: device switching`,
		'设备切换是核心机制而非装饰。5 台设备按章节阶梯解锁——玩家笔记本 → 被网暴者晓雨的手机 → 施暴者刀哥的电脑 → 旁观者陈同学的手机 → 方女士的平板，5 个平台级 App（泡泡 / 微语 / 聚点+知料 / 云屉 / Maila）内容互通。':
			`Device switching is the core mechanic, not decoration. Five devices unlock in a chapter-by-chapter ladder — your laptop → victim Xiaoyu's phone → harasser Bro Dao's PC → bystander Chen's phone → Ms. Fang's tablet — with 5 platform-level apps (Paopao / Weiyu / Judian+Zhiliao / Yunti / Maila) sharing content across all of them.`,
		'解锁条件绑定玩家行为：发出第一条评论才解锁晓雨的屏幕，溯源追查才解锁刀哥的电脑——<strong>新视角是你动作的直接后果</strong>':
			`Unlocks are bound to player behavior: the victim's screen opens only after you post your first comment, the harasser's PC only after you trace the source — <strong>each new perspective is the direct consequence of your actions</strong>`,
		'第 4 章网暴反噬直接落在玩家自己的笔记本上：玩家只有一块屏幕，反噬来临时无处可躲——封闭感即压迫感':
			`In chapter 4 the backlash lands on the player's own laptop: you have exactly one screen, and when the flood comes there is nowhere to hide — enclosure is the pressure`,
		'叙事结构：章节钉子': `Narrative structure: chapter nails`,
		'6 章 × 3 波次的两级结构：章内波次是软触发（热度阈值释放内容），章节钉子是硬触发——每章一个「必然发生、不可跳过」的世界状态改变（停职 / 完整截图流出 / 回应视频 / 被扒 / 热度归零）。':
			`A two-level structure of 6 chapters × 3 waves: in-chapter waves are soft triggers (content released at heat thresholds), while chapter "nails" are hard triggers — one unavoidable, unskippable change to the world state per chapter (suspension / the full screenshot leaks / a response video / getting doxxed / heat hitting zero).`,
		'玩家行为不决定钉子是否发生，只决定其形态（A / B / C）——节奏可控，选择仍有重量':
			`Player behavior never decides whether a nail happens, only the shape it takes (A / B / C) — pacing stays controllable while choices keep their weight`,
		'沉默也是一种被记录的形态': `Silence, too, is a recorded shape`,
		'玩家全部历史发言跨章继承，旧发言在后续章节继续变形发酵':
			`Your entire posting history carries across chapters — old comments keep mutating and fermenting in later ones`,
		'立场定调采用确定性分级：「未知全貌不予置评」做底色，「沉默即共谋」降级为特例——只有握证不发才被审判':
			`Stance judgment uses graded certainty: "don't judge without the full picture" is the baseline, while "silence is complicity" is demoted to a special case — you are judged only for withholding evidence you hold`,
		'伦理红线（设计硬约束）': `Ethical red lines (hard design constraints)`,
		'不复刻真实仇恨话术；不做说教': `No replicating real hate speech; no preaching`,
		'无真实人脸；贴图零烘焙文字，词库集中在可替换的数据表中': `No real faces; zero baked-in text on textures, with all vocabulary centralized in replaceable data tables`,
		'第 4 章（玩家被扒）可跳过；结尾提供真实求助资源': `Chapter 4 (getting doxxed) is skippable; the ending provides real help resources`,
		'实现与验证': `Implementation & verification`,
		'Unreal Engine 5.8 全蓝图实现（零 C++），已达成：': `Built in Unreal Engine 5.8 with blueprints only (zero C++). Achieved so far:`,
		'<strong>第一章完整可玩</strong>：正式节奏 30–35 分钟——开场、三波次推进、附图选择与逐条打码、发言四维度结算（证据门槛 / 打码 / 对人 / 真实热度）、强制阅读演出、数字结算全部落地':
			`<strong>Chapter 1 fully playable</strong> at a 30–35 minute pace: opening, three waves, image attachment with per-item censoring, four-dimension comment scoring (evidence gate / censoring / ad-hominem marking / real heat), a forced-reading scene, and numeric settlement`,
		'<strong>32 项 PIE 自动化回归通过</strong>，另有章节跳转 16 项、主菜单与设置 37 项回归；每次改动跑脚本验收、截图留档':
			`<strong>32 automated PIE regression checks passing</strong>, plus 16 for chapter navigation and 37 for main menu & settings; every change is script-verified with screenshot archives`,
		'<strong>数据管线</strong>：章节文案 JSON → GameInstance Map 键值，运行时 504+ 键；策划数据与蓝图逻辑解耦':
			`<strong>Data pipeline</strong>: chapter text as JSON → GameInstance Map keys, 504+ keys at runtime; design data stays decoupled from blueprint logic`,
		'<strong>AI 美术管线</strong>：Tripo 生成 + 人工修型的「玩具剧场」低模风格，47 条可复制提示词库 + 设备比例锁规范':
			`<strong>AI art pipeline</strong>: a "toy theatre" low-poly style via Tripo generation + hand retouching, with a 47-entry prompt library and device proportion-lock conventions`,
		'主菜单 / 设置（音量 / 分辨率 / 窗口模式持久化）与第 1–6 章跳转框架完成，后续章节内容开发中':
			`Main menu / settings (volume / resolution / window mode persistence) and the chapter 1–6 navigation framework are done; later chapters are in development`,
		'关键设计决策（ADR 节选）': `Key design decisions (selected ADRs)`,
		'项目全程用 Architecture Decision Record 留档，共 27+ 篇，摘录：': `Development was documented with Architecture Decision Records throughout — 27+ entries. Excerpts:`,
		'ADR-001 左右键切换设备的多视角叙事架构——核心机制地位的确立与「偷窥式」方案的否决':
			`ADR-001 Multi-perspective narrative via ←/→ device switching — establishing the mechanic's core status and rejecting the "voyeur" approach`,
		'ADR-003 立场定调：确定性分级——从「沉默即共谋」到「未知全貌不予置评」的修订':
			`ADR-003 Stance judgment: graded certainty — revising "silence is complicity" down to "don't judge without the full picture"`,
		'ADR-004 章节钉子结构——拒绝把叙事游戏降级成 checklist 的任务驱动': `ADR-004 Chapter-nail structure — refusing to degrade narrative into checklist-driven tasks`,
		'ADR-006 美术方向：玩具剧场与 Tripo 管线': `ADR-006 Art direction: toy theatre and the Tripo pipeline`,
		'ADR-010 数据层 Map 键值与全脚本蓝图生成': `ADR-010 Map-key data layer and script-generated blueprints`,
		'ADR-020 世界内文本规范与「去上帝视角」修订——48 处文案修正': `ADR-020 In-world text standards and the "de-godview" revision — 48 text fixes`,
		'ADR-022 发言四维度生效与按帖措辞': `ADR-022 Four-dimension comment scoring and per-thread wording`,
		'<a href="index.html" class="button large">← 返回全部项目</a>': `<a href="index.html" class="button large">← All projects</a>`,

		/* ---------- Good Kid goodkid.html ---------- */
		'Unity 2022 · VR · XR Interaction Toolkit · 恐怖叙事': `Unity 2022 · VR · XR Interaction Toolkit · Horror narrative`,
		'Good Kid<br> VR 弃屋探险': `Good Kid<br> VR Abandoned-House Adventure`,
		'VR 第一人称恐怖叙事：玩家在废弃房屋中探索，操作门、抽屉、灯具与日常物品，在看似平常的家庭规则下度过一晚又一晚——<strong>有些规则是假的</strong>。':
			`A first-person VR horror narrative: explore an abandoned house, operate doors, drawers, lamps, and everyday objects — and live through night after night under seemingly ordinary family rules. <strong>Some of those rules are lies.</strong>`,
		'恐怖不来自 Jump Scare 的堆砌，而来自<strong>「家庭规则的错位感」</strong>：童年房间的日常物件——门、抽屉、时钟、糖果、垃圾桶——承载一套看似合理的行为规则。玩家以孩子的身份执行这些规则，逐渐察觉规则本身的异常。':
			`The horror comes not from piled-up jump scares but from <strong>the uncanny fit of family rules</strong>: the everyday objects of a childhood room — doors, drawers, clocks, candy, the trash bin — carry a set of seemingly reasonable behavioral rules. Playing as the child, you follow them, and slowly notice that the rules themselves are wrong.`,
		'规则系统同时是叙事装置：<strong>4 条家庭规则中混有 1 条假规则</strong>（「不要进妈妈的房间」）。当玩家违返假规则时世界毫无反应——规则会撒谎，而发现这一点的瞬间，故事真正开始。':
			`The rule system doubles as a narrative device: <strong>1 of the 4 family rules is fake</strong> ("never enter mom's room"). Breaking the fake rule gets zero reaction from the world — the rules can lie, and the moment you notice, the real story begins.`,
		'核心系统设计': `Core system design`,
		'规则违规系统': `Rule-violation system`,
		'RuleID 枚举定义 4 条规则（3 真 1 假），ViolationSystem 统一调度违规反应':
			`A RuleID enum defines the 4 rules (3 real, 1 fake); a ViolationSystem dispatches all violation reactions`,
		'真规则违规触发递进的演出：灯光闪烁 → 黑雾侵蚀': `Breaking real rules escalates the staging: flickering lights → encroaching black fog`,
		'假规则区域（妈妈的房间）特殊处理：进入后零反应——「异常」本身就是叙事信息':
			`The fake-rule zone (mom's room) is handled specially: entering it triggers nothing — the "anomaly" is itself narrative information`,
		'日夜循环与节奏': `Day-night cycle & pacing`,
		'120 秒倒计时 + 日循环管理器，跨天状态重置（糖果未扔跨天判定违规）':
			`A 120-second countdown plus a day-cycle manager, with cross-day state resets (candy not thrown out carries a violation into the next day)`,
		'床睡眠交互：射线点床 → 黑屏过渡 → 传送至 BedSpawnPoint → 天数 +1':
			`Bed interaction: raycast the bed → fade to black → teleport to BedSpawnPoint → day counter +1`,
		'21:00 睡眠检查：到点不睡 → 违规判定': `21:00 sleep check: still awake at the deadline → violation`,
		'敲门事件与追捕': `Knock events & pursuit`,
		'随机敲门 + 限时躲藏：玩家必须进入躲藏安全区': `Random knocks with a timed hide window: the player must reach the hiding safe zone`,
		'超时未躲 → 怪物出现并追捕（3D 空间音频吼叫定位），抓到即重置当天':
			`Fail to hide in time → a monster spawns and hunts you (its roar positioned in 3D audio); getting caught resets the day`,
		'躲过敲门 → 「什么都没发生」——用日常化的平安夜晚反衬规则的不可知':
			`Survive the knock → "nothing happens" — an ordinary, uneventful night that throws the rules' unknowability into relief`,
		'纸页收集叙事': `Collectible-page storytelling`,
		'9 页纸片散布场景，射线拾起即阅读（世界空间 Canvas，9 页共享）':
			`9 paper pages scattered through the scene; raycast-pick one up to read it (a world-space canvas shared by all 9)`,
		'碎片化文本逐页拼出家庭往事，与规则系统互文': `Fragmented texts piece the family's past together page by page, interlocking with the rule system`,
		'全物理交互': `Fully physical interaction`,
		'9 扇手动门、抽屉（滑轨约束 + 卡扣 + 音效）、柜门、灯具触摸开关，全部基于 XR Interaction Toolkit 的抓取与射线交互':
			`9 manual doors, drawers (rail constraints + detents + audio), cabinet doors, and touch lamps — all built on XR Interaction Toolkit grab and ray interaction`,
		'VR 手感细节：射线落点视觉反馈、抓取时停止射线延伸、物理门铰链驱动':
			`VR feel details: visual ray-hit feedback, ray retraction while grabbing, physics-hinge door driving`,
		'场景与氛围': `Scenes & atmosphere`,
		'三个场景：开始菜单（巨幕 + 按钮 + 音乐）→ 主场景弃屋 → 结局演出（纯黑相机 + 巨幕）':
			`Three scenes: main menu (giant screen + buttons + music) → the abandoned house → ending staging (pure-black camera + giant screen)`,
		'夜空 HDRI 天空盒 + 邻居剪影街道 + 暗蓝灰草地，构建「从屋里看出去」的封闭视角':
			`A night-sky HDRI skybox, silhouetted neighbor houses, and dark blue-grey grass construct the enclosed "looking out from inside" viewpoint`,
		'URP 三套渲染管线（Balanced / HighFidelity / Performant）适配不同 VR 一体机性能档位':
			`Three URP pipeline assets (Balanced / High Fidelity / Performant) match different VR headset performance tiers`,
		'技术要点': `Technical notes`,
		'XR Interaction Toolkit 2.6 + OpenXR 1.14，New Input System': `XR Interaction Toolkit 2.6 + OpenXR 1.14, New Input System`,
		'相机高度锁 1.6m（儿童视角）——视角本身是叙事的一部分': `Camera height locked to 1.6m — a child's eye level; the viewpoint itself is part of the narrative`,
		'编辑器内 VR Simulator 工作流（Ctrl+Shift+WASD 模拟移动）支持无头显快速迭代':
			`In-editor VR Simulator workflow (Ctrl+Shift+WASD) allows fast iteration without a headset`,
		'游戏事件总线（GameEventBus）解耦规则判定与演出反应': `A GameEventBus decouples rule judgment from staging reactions`,
		'ADR-001 门 / 钥匙 / 投掷解锁交互链路': `ADR-001 Door / key / throw-to-unlock interaction chain`,
		'ADR-003 / 004 固定相机高度与物理身体的处理': `ADR-003 / 004 Fixed camera height and the physics body`,
		'ADR-005 结局独立场景架构': `ADR-005 Independent ending scene architecture`,
		'ADR-006 窗外夜景设计': `ADR-006 Night scenery outside the window`,
		'ADR-007 日间室外场景的压暗方案': `ADR-007 Darkening scheme for daytime exterior scenes`,

		/* ---------- 贪婪 greed.html ---------- */
		'UE 5.8 · 第一人称丧尸生存射击 · 关卡设计': `UE 5.8 · First-person zombie survival shooter · Level design`,
		'贪婪<br> GREED': `Greed<br> GREED`,
		'末日因人类对永生的贪婪而起——「永生药剂」临床失控引发尸变。玩家是末日拾荒者，核心机制<strong>「贪婪负担」</strong>：搜集的物资越多，移速与射速的负面效果越重；而最终 BOSS，会对高贪婪的玩家索取额外伤害。':
			`The apocalypse began with humanity's greed for eternal life — a "elixir of immortality" that failed catastrophically and triggered the outbreak. You are a post-apocalypse scavenger. The core mechanic is the <strong>Greed Burden</strong>: the more supplies you collect, the heavier your movement and fire-rate penalties — and the final BOSS exacts extra damage from high-greed players.`,
		'机制与主题互证': `Mechanics proving the theme`,
		'「贪婪」不是贴在世界观上的标签，而是写进每一次按键的机制：<strong>拿，还是不拿</strong>——每件物资都立刻变成移速与机动的代价，而 BOSS 的「贪婪索取」技能让这笔账在关卡终点一次性清算。玩家在关卡里的每一步，都在为进 BOSS 房时的自己做出选择。':
			`"Greed" is not a label pasted onto the setting; it is a mechanic written into every keypress: <strong>take, or leave</strong>. Every item immediately costs movement and mobility, and the BOSS's "Greed Tithe" skill settles that account in one stroke at the level's end. Every step through the level, you are choosing for the self who will enter the BOSS room.`,
		'轻装速通流：满机动风筝走位，放弃收益换生存': `Light-and-fast: full-mobility kiting, trading away loot for survival`,
		'贪婪搜刮流：高收益低机动，用走位压力换装备优势': `Greedy looting: high payout, low mobility, trading positional pressure for gear advantage`,
		'关卡设计：灰烬高塔': `Level design: Ashen Spire`,
		'当前关卡「灰烬高塔」是一座三层实验室 + 地下 BOSS 房的全封闭室内关卡，我独立完成从 LDD 设计文档、灰盒搭建到动线验证的全流程。':
			`The current level, "Ashen Spire", is a fully enclosed three-floor laboratory with an underground BOSS room. I owned the entire pipeline myself: LDD design document, grey-box construction, and flow validation.`,
		'动线结构（全区域串联）': `Flow structure: one chained route`,
		'2F 出生区 → 主廊 → 房间1 → 楼梯↓ 1F 房间2 → 精英房①「肿胀巨尸」→ 电梯↑ → 3F 房间3 + 三侧屋 → 走廊桥 → 精英房②「腐蚀喷吐者」（掉落「电梯电源核心」）→ 大电梯↓ 26m → BOSS「守库巨兽」→ 金库撤离':
			`2F spawn → main corridor → Room 1 → stairs↓ 1F Room 2 → Elite ① "Bloated Colossus" → elevator↑ → 3F Room 3 + three side rooms → corridor bridge → Elite ② "Corrosive Spitter" (drops the "Lift Power Core") → freight elevator↓ 26m → BOSS "Vault Guardian" → vault extraction`,
		'所有命名区域都在主路径上，不做支线化——关卡的每一米都被玩家走过':
			`Every named area sits on the critical path, no side-branching — every meter of this level is walked`,
		'BOSS 房唯一入口是大型货运电梯：击败 3F 精英拿到电源核心才能启动，下降 26 米的 12 秒是一段刻意为之的压迫段落':
			`The BOSS room's only entrance is the freight elevator: it starts only with the power core from the 3F elite, and the 26-meter, 12-second descent is a deliberately oppressive passage`,
		'单向门禁：让空间自己引导玩家': `One-way doors: letting space guide the player`,
		'出生点旁通往 1F 的电梯门、通往 3F 的东侧楼梯门均不可从 2F 侧打开——玩家被迫走完整个垂直循环，无法跳关':
			`The elevator door to 1F and the east stairwell door to 3F both refuse to open from the 2F side — the player is forced through the full vertical loop, with no way to skip ahead`,
		'东侧楼梯仅 3F 侧可开，构成 3F→2F 的单向撤回捷径': `The east stairs open only from 3F, forming a one-way 3F→2F retreat shortcut`,
		'设计意图：<strong>把「必须走完全程」从人为限制变成空间叙事</strong>——出生点被锁死本身就是关卡引导':
			`Design intent: <strong>turn "you must walk the whole way" from an artificial restriction into spatial narrative</strong> — the locked spawn point is the level's own tutorial`,
		'贪婪值锚点': `Greed anchors`,
		'贪婪机制绑定在 6 个具体拾取点上，让抽象数值变成一次次可感知的赌博：': `The greed mechanic is bound to 6 concrete pickup points, turning an abstract number into a series of palpable gambles:`,
		'A 初始装备 = 第一笔贪婪值入门': `A - starting gear = your first taste of greed`,
		'E 房间2 物资堆 = 第一次真正的抉择': `E - Room 2 supply pile = the first real decision`,
		'F 战后 AKM 必拿，但立刻加重负担': `F - the post-fight AKM is a must-take, and immediately deepens the burden`,
		'I 侧屋 = 贪婪值暴涨的诱惑点': `I - side rooms = temptation points where greed spikes`,
		'J 走廊桥 = 高贪婪直接兑换成风险（移速慢、无掩体暴露）': `J - corridor bridge = high greed cashed out directly as risk (slow movement, no cover)`,
		'M 落地前电梯口 = 最后的卸货权衡': `M - the elevator landing = the final drop-or-keep tradeoff`,
		'光照反转：最深处最亮': `Inverted lighting: the deepest floor is the brightest`,
		'2F 冷白均匀 → 走廊半明半暗 → BOSS 房过曝纯白——刻意打破「越深越暗」的恐怖关卡惯式':
			`2F even cold-white → half-lit corridors → overexposed pure white in the BOSS room — deliberately breaking the "deeper means darker" horror convention`,
		'压抑感来自无菌般的纯净（药企「纯化舱」意象），而非黑暗': `The oppression comes from sterile purity (the pharma "purification chamber" image), not from darkness`,
		'电梯门开启的瞬间 = 光照与空间的双重反转，是整座塔的 Hook 时刻':
			`The moment the elevator doors open = a double reversal of light and space — the whole tower's hook moment`,
		'BOSS 房空旷无掩体：风筝走位是唯一「掩体」，战斗压力直接由玩家此前的搜刮决策决定':
			`The BOSS room is bare, with no cover: kiting is the only "cover", and combat pressure is decided directly by the looting choices you made earlier`,
		'实现状态': `Implementation status`,
		'239 件建造件全封闭灰盒：1m 网格稠密审计 + 射线复验全部 HIT，白名单外的洞口为零':
			`A fully enclosed grey-box of 239 building pieces: 1m-grid density audit plus ray re-verification, all HIT — zero holes outside the door whitelist`,
		'三座折返楼梯 + 两部电梯（G 电梯轿厢 + 滑门传送蓝图；L 大电梯 10 段折返坡道）立体动线全部可通行':
			`Three switchback stairs + two elevators (G lift cab with sliding-door teleport blueprint; L freight lift with a 10-segment switchback ramp) — the full vertical flow is traversable`,
		'丧尸 AI 行为树（随机移动 / 发现玩家 / 追击至最后位置）、武器（AKM / SCAR）与拾取系统就绪':
			`Zombie AI behavior trees (random wander / spot player / chase to last known position), weapons (AKM / SCAR), and the pickup system are in place`,
		'36+ 盏动态点灯全 Movable，配合 Lumen 不烘焙': `36+ dynamic point lights, all Movable, unbaked with Lumen`,
		'开发过程：文档驱动的关卡管线': `Process: a document-driven level pipeline`,
		'<strong>LDD 设计文档先行</strong>：9 页成品（总览图 / 剖面图 / 流程图 / Note / Flow 表 / Hooks），美学、节奏、机制锚点全部成文后才动工':
			`<strong>LDD document first</strong>: a 9-page deliverable (overview / section / flow diagrams, notes, flow tables, hooks) — aesthetics, pacing, and mechanic anchors all in writing before any construction`,
		'<strong>数据驱动重建</strong>：权威建造清单（build_all.json：205 件建造件的名称 / 位置 / 尺寸 / 俯仰 / 材质）——场景损坏时可按清单精确重建，关卡即数据':
			`<strong>Data-driven rebuilds</strong>: an authoritative build manifest (build_all.json: name / position / size / pitch / material for 205 pieces) — the scene can be precisely reconstructed from data; the level is data`,
		'<strong>灰盒验证优先</strong>：封闭性 / 连通性 / 灯光节奏先于美术资产验证，几何确认后才进入道具与布光阶段':
			`<strong>Grey-box validation first</strong>: enclosure / connectivity / lighting rhythm are verified before art assets enter; props and lighting come only after the geometry is proven`,
		'ADR-001 LDD 文档生产管线': `ADR-001 The LDD document production pipeline`,
		'ADR-002 灰烬高塔关卡核心结构与贪婪机制绑定': `ADR-002 Ashen Spire core structure and its binding to the greed mechanic`,
		'ADR-003 Tripo 会员资产管线': `ADR-003 The Tripo asset pipeline`,

		/* ---------- 刀歌 daoge.html ---------- */
		'Unity 2022 · 2D 像素 · 经营 + 战斗 + 探索': `Unity 2022 · 2D Pixel · Management + Combat + Exploration`,
		'刀歌<br> MANAGE &amp; FIGHT': `Blade Song<br> MANAGE &amp; FIGHT`,
		'铁匠铺经营 × 回合制战斗 × 地图探索三合一——白天在铺子里打铁卖武器，攒够装备出门讨伐。玩家扮演铁匠，在<strong>锻造、售卖、冒险</strong>三条线之间循环推进。':
			`Blacksmith management × turn-based combat × map exploration. By day you forge and sell weapons in your shop; once stocked up, you head out to hunt. Playing the blacksmith, you cycle through three interwoven lines: <strong>forging, selling, adventuring</strong>.`,
		'游戏循环': `The game loop`,
		'经营（卖武器接订单）→ 锻造（加热 / 锻打 / 组装）→ 地图（限时探索）→ 战斗（回合制讨伐）→ 带着战利品回铺子':
			`Shop (sell weapons, take orders) → Forge (heat / hammer / assemble) → Map (timed exploration) → Battle (turn-based hunts) → back to the shop with the loot`,
		'时间、金币、HP 三项全局状态跨场景持久化：经营里攒下的每一枚金币、地图上受的每一处伤，都会在下一个场景如实延续——三条系统线不是三个小游戏，而是同一份账本。':
			`Time, gold, and HP persist globally across scenes: every coin earned in the shop and every wound taken on the map carries faithfully into the next scene. The three system lines are not three mini-games — they are one shared ledger.`,
		'锻造系统：三工位流水线': `Forging: a three-station assembly line`,
		'锻造是本作的核心玩法差异点，设计成一条有物理感的流水线，每个工位是一个独立状态机：':
			`Forging is the game's core differentiator, designed as a tactile assembly line where every station is its own state machine:`,
		'<strong>加热台</strong>：Empty → Heating → Max → Cooling 四态——材料有「火候」概念，热力值实时写入材料数据，过热会进入冷却':
			`<strong>Heating station</strong>: Empty → Heating → Max → Cooling — materials have a "doneness" concept; heat value is written into material data in real time, and overheating tips into cooldown`,
		'<strong>锻造台</strong>：Empty → Ready → Forging → Paused → Complete——热力 ≥ 50 才允许锻打，玩家点击锻打推进度：火候与手速双重门槛':
			`<strong>Forging station</strong>: Empty → Ready → Forging → Paused → Complete — hammering unlocks at heat ≥ 50, and each click advances progress: a dual gate of timing and speed`,
		'<strong>组装台</strong>：双槽位提交，匹配顾客任务需求判定成品': `<strong>Assembly station</strong>: a two-slot submission matched against the customer's order to judge the result`,
		'<strong>全链路拖拽</strong>：仓库 → 加热台 → 锻造台 → 组装台支持任意回转搬运，操作流贴近真实打铁的物料周转':
			`<strong>End-to-end dragging</strong>: warehouse → heat → forge → assemble, with free back-and-forth movement that mirrors the material flow of real smithing`,
		'顾客任务由 ScriptableObject 数据库驱动（5 个默认任务 + 特殊顾客随机分配），新任务零代码扩展':
			`Customer orders are driven by a ScriptableObject database (5 default orders + random assignment to special customers) — new orders need zero code`,
		'经营系统': `The shop system`,
		'<strong>顾客流</strong>：2D 移动的顾客进出店门，所有参数（速度 / 范围 / 出入口 / 付款位）Inspector 可调并配 Scene 视图可视化手柄':
			`<strong>Customer traffic</strong>: 2D customers flow in and out of the door; every parameter (speed / range / entrance / exit / pay spot) is Inspector-tunable with scene-view handles`,
		'<strong>特殊顾客</strong>：首单延迟 10 秒入场，场上同时仅一位，离开 30 秒重生——生成即分配锻造任务，把「接单」变成经营与锻造的枢纽':
			`<strong>Special customers</strong>: the first arrives after a 10-second delay, only one exists at a time, and each respawns 30 seconds after leaving — spawning with a forging order attached, making "taking orders" the hinge between shop and forge`,
		'<strong>库存与定价</strong>：3 柜 × 4 格共 12 格仓储；材料按稀有度定价（Common 50 / Uncommon 100 / Rare 200 / Legendary 400）':
			`<strong>Stock & pricing</strong>: 3 cabinets × 4 slots = 12 storage cells; materials priced by rarity (Common 50 / Uncommon 100 / Rare 200 / Legendary 400)`,
		'<strong>一键上架</strong>：补满全部非锁空格；仓库空或格子满时按钮变灰并给 Tooltip——状态反馈优先于操作':
			`<strong>One-click restock</strong>: fills every unlocked empty cell; the button greys out with a tooltip when the warehouse is empty or slots are full — state feedback before action`,
		'战斗系统：严格回合制状态机': `Combat: a strictly turn-based state machine`,
		'战斗被设计成<strong>单线程、严格轮流</strong>的状态机，规则透明、无隐藏变量：':
			`Combat is designed as a <strong>single-threaded, strictly alternating</strong> state machine — transparent rules, no hidden variables:`,
		'PlayerTurn ⇄ EnemyTurn → Victory / Defeat': `PlayerTurn ⇄ EnemyTurn → Victory / Defeat`,
		'<strong>技能目标类型三分</strong>：Self（治疗 / 防御，直接执行）、AllEnemies（AOE 全体结算）、SingleEnemy（进入选目标模式，高亮存活敌人，点选才结算）——交互流程由数据驱动':
			`<strong>Three skill target types</strong>: Self (heal / guard, executes instantly), AllEnemies (AOE resolves against everyone), SingleEnemy (enters target-selection mode, highlights living enemies, resolves on click) — the interaction flow is data-driven`,
		'<strong>敌人队列行动</strong>：按顺序依次动作，0.8 秒间隔，节奏可读': `<strong>Enemy action queue</strong>: enemies act in order at 0.8-second intervals — a readable rhythm`,
		'<strong>只有三种结果</strong>：全灭敌人、玩家死亡、逃跑（按 Defeat 处理）——没有平局与超时，规则极简':
			`<strong>Only three outcomes</strong>: enemies wiped, player dead, or fleeing (treated as defeat) — no draws, no timeouts; minimal rules`,
		'<strong>与经营互通</strong>：战斗中 HP 从全局 PlayerStats 读取，受伤同步回写；胜利标记地图格子已讨伐，失败记录死亡格、次日复活':
			`<strong>Bridged with the shop</strong>: combat HP is read from the global PlayerStats and damage writes back; victory marks the map tile as cleared, defeat records the death tile and respawns you next day`,
		'地图探索：时间制的大地图': `Map exploration: a time-budgeted overworld`,
		'7×7 网格固定种子生成，跨天继承已探索状态': `A 7×7 grid from a fixed seed, with explored state inherited across days`,
		'<strong>时间代替步数</strong>：每移动一格流逝 2 小时，默认 12 小时探索上限——路线规划是资源规划':
			`<strong>Time instead of steps</strong>: each tile moved costs 2 hours against a default 12-hour exploration budget — route planning is resource planning`,
		'四类地块：事件（多选一奖励）/ 战斗（跳转战斗场景）/ 村庄（休整 + 补给）/ 商店（购买）':
			`Four tile types: event (pick-one-of rewards) / battle (jumps to the combat scene) / village (rest + resupply) / shop (buying)`,
		'时间耗尽弹窗强制收束，带返回按钮——每一天都有明确的边界感': `A time's-up popup forces closure with a return button — every day has a hard, legible edge`,
		'工程方法：编辑器工具链': `Engineering method: the editor toolchain`,
		'本项目沉淀了一条「UI 由工具生成」的管线：14 个 <code>Tools &gt; Build *</code> 幂等编辑器菜单一键搭建战斗界面、地图界面、锻造页面、弹窗等全部 UI——场景操作走工具而非手拼，参数全部 SerializeField 暴露。跑过一次的开发流程，直接复用进了后续项目。':
			`This project distilled a "UI generated by tools" pipeline: 14 idempotent <code>Tools &gt; Build *</code> editor menus one-click-build the battle screen, map screen, forging page, popups, and all other UI — scene work goes through tools instead of hand-assembly, with every parameter exposed via SerializeField. The workflow built here was reused directly in later projects.`,
		'ADR-001 UI 编辑器化生成——运行时不重建': `ADR-001 Editor-generated UI — no runtime rebuilds`,
		'ADR-002 / 005 单例 DontDestroyOnLoad 与主从模式的全局状态管理': `ADR-002 / 005 Singleton DontDestroyOnLoad and master-slave global state`,
		'ADR-006 锻造台动态生成': `ADR-006 Dynamic forging-station generation`,
		'ADR-008 技能数据动态装配': `ADR-008 Dynamic skill data assembly`,

		/* ---------- 2D RPG rpg.html ---------- */
		'Unity 6 · 2D 横板动作 · 叙事驱动': `Unity 6 · 2D side-scrolling action · Narrative-driven`,
		'2D 像素 RPG<br> 暂定名': `2D Pixel RPG<br> untitled`,
		'立意「偏见」：印象中的好人不一定是好人，坏人也不一定是坏人，不要以貌取人。受神赐福的勇者开局碾压魔物，中途<strong>视角反转成魔物求生</strong>，最终揭露神才是幕后黑手。':
			`Theme: prejudice. The good people you picture are not always good, nor the bad ones bad — never judge by appearances. A hero blessed by god stomps monsters, until <strong>the perspective flips and you survive as the monster</strong>, uncovering god as the true villain.`,
		'立意与叙事架构': `Theme & narrative architecture`,
		'整个项目有一条统一的评判标准：<strong>「这个设计是否服务偏见立意」</strong>。主线结构从这条标准推导出来：':
			`The whole project runs on one judging criterion: <strong>"does this design serve the theme of prejudice?"</strong>. The main storyline is derived from it:`,
		'勇者受神赐福 → 碾压式屠杀魔物 → 勇者失去控制，视角切到魔物 → 以魔物视角逃亡 / 寻找同伴 / 与冒险者战斗 → 再遇勇者 → 逃到魔王 → 神是真反派 → 多结局':
			`Hero blessed by god → stomping monsters → the hero loses control and the perspective cuts to the monster → fleeing / finding companions / fighting adventurers as the monster → meeting the hero again → reaching the demon king → god is the true villain → multiple endings`,
		'明确否决的两个替代方案：传统勇者打魔王的直线叙事（无法表达偏见反转）；双主角自由切换（失去「被赐福方堕入真相」的进程感）——最终采用<strong>剧本强制的单次视角反转</strong>。':
			`Two alternatives were explicitly rejected: the traditional hero-vs-demon-king linear story (it cannot express the reversal of prejudice), and free dual-protagonist switching (it loses the arc of <strong>the blessed one falling into truth</strong>) — the final choice is a <strong>script-mandated, single perspective reversal</strong>.`,
		'血条作为叙事工具': `Health bars as a narrative tool`,
		'本作最有代表性的一处机制叙事：<strong>同一手法，相反含义</strong>。': `The game's most representative piece of mechanical storytelling: <strong>the same device, opposite meanings</strong>.`,
		'开局打魔物不显示血条——魔物「不配被当对手」，碾压感由 UI 缺席表达':
			`Early monsters get no health bar — they are "not worth measuring"; the stomp is expressed by the UI's absence`,
		'终局打魔王也不显示血条——但这次是「打不死」的绝望，UI 缺席表达的是自己的渺小':
			`The final demon king gets no health bar either — but this time it is the despair of "it won't die"; the absence expresses your own smallness`,
		'数值同理：玩家初始数值极高 = 神的赐福（也是神的枷锁）；赐福被收走后，同一套数值变成了「硬仗」':
			`Stats work the same way: your huge initial numbers are god's blessing (and god's leash); once the blessing is reclaimed, the same numbers become "a hard fight"`,
		'机制服务立意': `Mechanics serving the theme`,
		'怪物伤害其次、特殊效果为主：击退、控制、地形击杀（被撞下悬崖）——「打赢」不是唯一语言':
			`Monster damage is secondary to special effects: knockback, control, terrain kills (knocked off cliffs) — "winning the DPS race" is not the only language`,
		'宝箱只出交互能力道具（二段跳），不出攻击强化——重逻辑轻战斗':
			`Chests only grant interaction abilities (double jump), never attack upgrades — logic over combat`,
		'数值基准清晰量化：跳远 6 格 / 跳高 4 格 / 摔落 10 格摔死——关卡设计有共同的度量衡':
			`Clean numeric baselines: 6 tiles of jump distance / 4 of height / death at a 10-tile fall — level design with a shared ruler`,
		'结局体系：神像 × 隐藏房间的 2×2 矩阵': `The ending system: a 2×2 matrix of god statue × hidden room`,
		'结局由两个收集旗标 + 魔王战胜负决定，两个旗标各司其职：': `Endings are decided by two collectible flags plus the demon-king fight, each flag with its own role:`,
		'<strong>神像（神殿）= 实力线</strong>：砸神像 → 赐福被收走，属性大幅下降，之后全程打怪变难；但赐福本质是神的压制标记，没了它终局打神反而轻松。第一次砸时神会出声警告，砸下不可反悔，并可获得隐藏武器':
			`<strong>The god statue (temple) = the power line</strong>: smash it and the blessing is reclaimed — stats drop hard and every fight gets tougher; but the blessing is really god's suppression mark, and without it the final fight against god becomes far easier. The first strike draws an audible warning from god; the act is irreversible, and grants a hidden weapon`,
		'<strong>隐藏房间（城堡石盘）= 真相线</strong>：找到 → 知道神的真相 → 解锁「与魔王和解」剧情':
			`<strong>The hidden room (castle stone disc) = the truth line</strong>: find it → learn god's truth → unlock the "reconcile with the demon king" storyline`,
		'神像': `Statue`,
		'隐藏房间': `Hidden room`,
		'流程体验': `Playthrough`,
		'终局': `Ending`,
		'没毁': `Kept`,
		'找到': `Found`,
		'没找': `Missed`,
		'全程碾压，蒙在鼓里': `Stomping through, kept in the dark`,
		'获得神的奖励（虚假好结局，奖励演出埋「不对劲」细节驱动二周目）':
			`Receive god's reward (a false good ending; the reward staging plants "off" details that drive a second playthrough)`,
		'碾压 + 知道真相': `Stomping, but knowing the truth`,
		'和解 → 与魔王共同打神（赐福仍是神的压制，此线最难）':
			`Reconcile → fight god together with the demon king (the blessing still suppresses you; hardest line)`,
		'毁了': `Smashed`,
		'全程硬仗': `A grind all the way`,
		'无和解剧情，直接打神': `No reconciliation — straight to fighting god`,
		'硬仗 + 知道真相': `A grind, but knowing the truth`,
		'和解 → 共同打神（最轻松，全收集奖励）': `Reconcile → fight god together (easiest, full-collection reward)`,
		'共同打神：胜 → 世界和平（真结局）；败 → 重播开场动画（轮回结局，暗示神的循环操控）。没打败魔王则切魔王视角打神：胜 → 魔王给勇者上坟；败 → 重播开场。合计 <strong>5 个独立结局</strong>。':
			`Fighting god together: win → world peace (true ending); lose → the opening animation replays (a reincarnation ending implying god's cycle of control). Lose to the demon king and you take his perspective against god: win → the demon king mourns at the hero's grave; lose → the opening replays. <strong>5 distinct endings</strong> in total.`,
		'时序设计上还有一处刻意的不对称：神像在地图 1 的神殿，而「切回勇者线」不可回头——<strong>毁神像的机会只在第一次流程存在</strong>，选择有真实的时效重量。':
			`One deliberate asymmetry in the sequencing: the statue sits in the map-1 temple while "returning to the hero line" is one-way — <strong>the chance to smash the statue exists only on the first pass</strong>, giving the choice real time-sensitive weight.`,
		'关卡与场景表': `Levels & scene table`,
		'8 张地图各带一个独有机制，服务对应的剧情段落：': `Eight maps, each carrying one unique mechanic serving its story beat:`,
		'<strong>神殿 + 草原</strong>：新手引导——祭坛（与神对话）、可破坏神像（暗线入口）':
			`<strong>Temple + grassland</strong>: onboarding — the altar (dialogue with god) and the smashable statue (hidden-line entrance)`,
		'<strong>山坡</strong>：小型 BOSS 战 · <strong>地下城</strong>：黑暗探索与单侧解锁门':
			`<strong>Hillside</strong>: a mini-BOSS fight · <strong>dungeon</strong>: dark exploration with one-way unlocked doors`,
		'<strong>森林</strong>：救同伴战斗（笼子可被攻击损坏的动态救援）':
			`<strong>Forest</strong>: a rescue fight (cages destructible for dynamic rescue)`,
		'<strong>平原</strong>：潜行——魔物视角偷东西不能被发现（玩法随立场反转而反转）':
			`<strong>Plains</strong>: stealth — as the monster you must steal without being seen (the gameplay reverses with the perspective)`,
		'<strong>城堡</strong>：石盘隐藏房间（真相线）· <strong>BOSS 房</strong>：不显示血条的魔王 · <strong>天堂</strong>：终局竞技场':
			`<strong>Castle</strong>: the stone-disc hidden room (truth line) · <strong>BOSS room</strong>: the barless demon king · <strong>heaven</strong>: the final arena`,
		'系统实现': `Systems implemented`,
		'完整动作平台框架：角色控制器 + 8 状态动画机，8 类怪物 AI（巡逻 / 追击 / 攻击）':
			`A complete action-platformer framework: character controller + 8-state animator, 8 monster AI types (patrol / chase / attack)`,
		'<strong>AnimationEvent 驱动的命中判定</strong>：攻击剪辑 60% 处事件结算——判定精度对齐动画帧而非定时器':
			`<strong>AnimationEvent-driven hit detection</strong>: hits resolve at the 60% mark of attack clips — judgment aligned to animation frames, not timers`,
		'摔死系统：落地结算 + 传送 / 重生 2 秒豁免窗 + 贴坡滑坠累计；着地检测取最大向上法线并排除触发器':
			`Fall-death system: landing resolution + a 2-second exemption window after teleports/respawns + slope-slide accumulation; ground detection takes the max upward normal and excludes triggers`,
		'像素级水陷阱：水面与中层零碰撞，仅每列最底水格像素精确致命——沉底才死':
			`Pixel-precise water hazards: surface and mid-water have zero collision; only the bottom water cell of each column is lethal, pixel-aligned — you die only when you sink`,
		'BOSS 门通用封锁（场景级门禁挂三关）与视角反转三关触发（勇者坠虚空接管狼 / HP 归零接管魔王 / 终局开局即魔王）':
			`A reusable BOSS-gate lock (scene-level gating on three levels) and three perspective-reversal triggers (hero falls into the void → take the wolf; HP hits zero → take the demon king; the finale opens as the demon king)`,
		'全套幂等编辑器工具（相机跟随 / 死亡 UI / 宝箱 / 尖刺 / 怪物动画机生成）支撑快速迭代':
			`A full suite of idempotent editor tools (camera follow / death UI / chests / spikes / monster animator generation) supporting fast iteration`,
		'ADR-001 立意与叙事反转架构——偏见': `ADR-001 Theme and the narrative-reversal architecture — prejudice`,
		'ADR-006 攻击判定绑定动画帧': `ADR-006 Binding hit detection to animation frames`,
		'ADR-009 BOSS 门通用封锁': `ADR-009 A reusable BOSS-gate lock`,
		'ADR-010 视角反转三关触发': `ADR-010 Three perspective-reversal triggers`,
		'ADR-011 水陷阱沉底判死与像素对齐': `ADR-011 Sink-to-die water hazards with pixel alignment`,
		'ADR-012 结局体系与赐福对赌': `ADR-012 The ending system and the blessing wager`,

		/* ---------- 页面标题 ---------- */
		'__title__Yannis · 游戏开发作品集': `Yannis · Game Development Portfolio`,
		'__title__Yannis · 作品集 PORTFOLIO': `Yannis · Portfolio`,
		'__title__涟漪 RIPPLE · 设计文档 — Yannis 作品集': `Ripple RIPPLE · Design Document — Yannis Portfolio`,
		'__title__Good Kid · VR 弃屋探险 — Yannis 作品集': `Good Kid · VR Adventure — Yannis Portfolio`,
		'__title__贪婪 GREED · 关卡设计 — Yannis 作品集': `Greed GREED · Level Design — Yannis Portfolio`,
		'__title__刀歌 MANAGE & FIGHT · 系统设计 — Yannis 作品集': `Blade Song MANAGE & FIGHT · System Design — Yannis Portfolio`,
		'__title__2D 像素 RPG · 叙事与结局设计 — Yannis 作品集': `2D Pixel RPG · Narrative & Ending Design — Yannis Portfolio`
	};

	function norm(s) {
		return s.replace(/\s+/g, ' ').trim();
	}

	var SELECTOR = [
		'#nav ul.links li a',
		'#intro h1', '#intro p', '#intro ul li',
		'#main h1', '#main h2', '#main h3',
		'#main p', '#main ul li', '#main blockquote',
		'#main table th', '#main table td',
		'#main span.date',
		'#footer h3', '#footer section p',
		'#copyright ul li'
	].join(', ');

	var en = localStorage.getItem('lang') === 'en';
	var saved = new Map();
	var savedTitle = null;
	var toggle = null;

	function buildSwitcher() {
		if (document.getElementById('langSwitch')) return;
		var div = document.createElement('div');
		div.id = 'langSwitch';
		div.setAttribute('role', 'group');
		div.setAttribute('aria-label', 'Language / 语言');
		div.innerHTML =
			'<button type="button" data-lang="zh" title="切换到中文">中文</button>' +
			'<button type="button" data-lang="en" title="Switch to English">EN</button>';
		document.body.appendChild(div);
	}

	function syncSwitcher() {
		var box = document.getElementById('langSwitch');
		if (!box) return;
		var btns = box.querySelectorAll('button');
		for (var i = 0; i < btns.length; i++) {
			var b = btns[i];
			var isActive = (b.getAttribute('data-lang') === 'en') === en;
			b.className = isActive ? 'active' : '';
		}
	}

	function apply() {
		var nodes = document.querySelectorAll(SELECTOR);
		for (var i = 0; i < nodes.length; i++) {
			var el = nodes[i];
			if (el.id === 'langToggle') continue;
			var key = norm(el.innerHTML);
			if (en) {
				if (!saved.has(el)) saved.set(el, el.innerHTML);
				if (Object.prototype.hasOwnProperty.call(DICT, key)) el.innerHTML = DICT[key];
			} else if (saved.has(el)) {
				el.innerHTML = saved.get(el);
			}
		}
		var tKey = '__title__' + (en && savedTitle !== null ? savedTitle : document.title);
		if (!en && savedTitle !== null) { document.title = savedTitle; }
		else if (en && Object.prototype.hasOwnProperty.call(DICT, tKey)) {
			if (savedTitle === null) savedTitle = document.title;
			document.title = DICT[tKey];
		}
		document.documentElement.lang = en ? 'en' : 'zh-CN';
		syncSwitcher();
		localStorage.setItem('lang', en ? 'en' : 'zh');
	}

	function setLang(isEn) {
		en = isEn;
		apply();
	}

	function init() {
		// 首次访问：按浏览器语言选择初始语言；之后以用户手选为准
		if (localStorage.getItem('lang') === null) {
			var nav = (navigator.language || navigator.userLanguage || 'zh');
			en = !/^zh/i.test(nav);
			localStorage.setItem('lang', en ? 'en' : 'zh');
		}
		buildSwitcher();
		var box = document.getElementById('langSwitch');
		if (box) {
			box.addEventListener('click', function (e) {
				var btn = e.target.closest('button[data-lang]');
				if (!btn) return;
				e.preventDefault();
				setLang(btn.getAttribute('data-lang') === 'en');
			});
		}
		toggle = document.getElementById('langToggle');
		if (toggle) {
			toggle.addEventListener('click', function (e) {
				e.preventDefault();
				setLang(!en);
			});
		}
		apply();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
