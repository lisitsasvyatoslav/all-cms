import type { TypographyScaleGroup } from "@/components/portal/brand/brand-typography-scale";
import type { BrandPageContent } from "@/lib/portal/brand/content";
import type { BrandPageSlug } from "@/lib/portal/brand/nav";
import type { BrandColorData } from "@/lib/portal/brand/color-data";
import { brandIconsImagePaths } from "@/lib/portal/brand/images/icons";
import { brandLogoAdaptationImagePaths } from "@/lib/portal/brand/images/logos-adaptation";
import { brandLogoMisuseImagePaths } from "@/lib/portal/brand/images/logos-misuse";

const INTER_CSS_IMPORT = `<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
</style>`;

const HEADING_SCALE: TypographyScaleGroup["rows"] = [
  { name: "Display", fontSize: 52, lineHeight: 56, letterSpacing: -0.8, weight: 700 },
  { name: "Headline 1", fontSize: 40, lineHeight: 48, letterSpacing: -0.5, weight: 500 },
  { name: "Headline 2", fontSize: 28, lineHeight: 32, letterSpacing: -0.4, weight: 500 },
  { name: "Headline 3", fontSize: 24, lineHeight: 28, letterSpacing: -0.3, weight: 500 },
  { name: "Headline 4", fontSize: 20, lineHeight: 24, letterSpacing: -0.2, weight: 500 },
  { name: "Headline 5", fontSize: 18, lineHeight: 24, letterSpacing: -0.2, weight: 500 },
  { name: "Headline 6", fontSize: 16, lineHeight: 24, letterSpacing: -0.2, weight: 500 },
];

const PARAGRAPH_SCALE: TypographyScaleGroup["rows"] = [
  { name: "Paragraph L", fontSize: 18, lineHeight: 24, letterSpacing: -0.2, weight: 400 },
  { name: "Paragraph M", fontSize: 16, lineHeight: 24, letterSpacing: -0.2, weight: 400 },
  { name: "Paragraph S", fontSize: 14, lineHeight: 20, letterSpacing: -0.06, weight: 400 },
  { name: "Paragraph XS", fontSize: 16, lineHeight: 24, letterSpacing: 0, weight: 400 },
];

const LABEL_SCALE: TypographyScaleGroup["rows"] = [
  { name: "Label L", fontSize: 16, lineHeight: 22, letterSpacing: -0.1, weight: 500 },
  { name: "Label M", fontSize: 14, lineHeight: 16, letterSpacing: -0.06, weight: 500 },
  { name: "Label S", fontSize: 12, lineHeight: 14, letterSpacing: 0, weight: 500 },
];

export const BRAND_OVERVIEW_SEED = {
  title: "Brand",
  intro:
    "Бренд-гайдлайны задают узнаваемый визуальный язык: логотипы, иконки, типографика, палитра и принципы оформления.",
  shareTitle: "Brand",
  shareDescription:
    "Бренд-гайдлайны: логотипы, иконки, шрифты, палитра и визуальный стиль.",
};

export const BRAND_PAGES_SEED: Record<BrandPageSlug, BrandPageContent> = {
  logos: {
    slug: "logos",
    title: "Логотипы",
    description: "Адаптация к фону, охранные поля и запрещённые варианты использования.",
    intro:
      "Правила помогают сохранить узнаваемость логотипа на любых носителях — от интерфейсов до печатных материалов.",
    sections: [
      {
        type: "logo-background-grid",
        id: "logo-background",
        heading: "Адаптация логотипа к фону",
        rules: [
          {
            label: "Градиентный на тёмном фоне",
            surface: "dark",
            logoSrc: brandLogoAdaptationImagePaths.gradientDark,
          },
          {
            label: "Градиентный на белом фоне",
            surface: "light",
            logoSrc: brandLogoAdaptationImagePaths.gradientLight,
          },
          {
            label: "Белый на тёмном фоне",
            surface: "dark",
            logoSrc: brandLogoAdaptationImagePaths.solidWhite,
          },
          {
            label: "Чёрный на белом или сером фоне",
            surface: "light",
            logoSrc: brandLogoAdaptationImagePaths.solidBlack,
          },
        ],
      },
      {
        type: "logo-clearspace",
        id: "logo-clearspace",
        heading: "Охранные поля",
        items: [
          "Свободное пространство вокруг логотипа обеспечит максимально правильное восприятие.",
          "Единицей измерения выбрана буква Ф из графического начертания.",
          "Никакие элементы графики и фотографий не могут попадать в область свободного пространства логотипа.",
        ],
      },
      {
        type: "logo-misuse-grid",
        id: "logo-misuse",
        heading: "Запрещённые варианты",
        intro:
          "Чтобы сохранять узнаваемость логотипа, нельзя изменять его элементы. Ниже — примеры запрещённого использования.",
        items: [
          { imageSrc: brandLogoMisuseImagePaths["wrong-colors"], text: "изменять цвета логотипа" },
          { imageSrc: brandLogoMisuseImagePaths["wrong-font"], text: "изменять шрифтовое написание" },
          { imageSrc: brandLogoMisuseImagePaths["wrong-layout"], text: "менять расположение элементов логотипа" },
          { imageSrc: brandLogoMisuseImagePaths["rotate-elements"], text: "поворачивать элементы логотипа" },
          { imageSrc: brandLogoMisuseImagePaths["rotate-logo"], text: "поворачивать логотип" },
          { imageSrc: brandLogoMisuseImagePaths.stretch, text: "искажать размеры логотипа" },
          { imageSrc: brandLogoMisuseImagePaths.clearspace, text: "нарушать границы охранного поля" },
          { imageSrc: brandLogoMisuseImagePaths.shadow, text: "использовать тень" },
          { imageSrc: brandLogoMisuseImagePaths["low-contrast"], text: "использовать логотип на неконтрастных фонах" },
          { imageSrc: brandLogoMisuseImagePaths["busy-background"], text: "использовать логотип поверх сложного фона" },
          { imageSrc: brandLogoMisuseImagePaths.legacy, text: "использовать устаревшую версию логотипа" },
        ],
      },
    ],
  },
  icons: {
    slug: "icons",
    title: "Иконки",
    description: "Стиль, размеры и примеры использования иконок в интерфейсе.",
    intro:
      "Иконки дизайн-системы выполнены в объёмном 3D-стиле и масштабируются по сетке 8 px.",
    sections: [
      {
        type: "content-accordion",
        id: "icons-sections",
        items: [
          {
            id: "icon-style",
            heading: "Стиль иконок",
            blocks: [
              { type: "subheading", text: "Форма и материалы" },
              {
                type: "paragraph",
                text:
                  "Иконки выполнены в объёмном 3D-стиле с простой геометрией и мягкими скруглениями.",
              },
              {
                type: "paragraph",
                text:
                  "Иконки имеют чистую форму без лишних деталей, поэтому остаются хорошо читаемыми даже в небольшом размере.",
              },
              {
                type: "figure",
                src: brandIconsImagePaths.shapeMaterials,
                alt: "Примеры 3D-иконок: форма и материалы",
              },
              { type: "subheading", text: "Размеры" },
              {
                type: "paragraph",
                text:
                  "Иконки масштабируются с шагом 8 px и используются в размерах, кратных этой сетке: 16 px, 24 px, 32 px, 40 px, 48 px и далее.",
              },
              {
                type: "figure",
                src: brandIconsImagePaths.sizes,
                alt: "Шкала размеров 3D-иконок",
              },
            ],
          },
          {
            id: "usage-examples",
            heading: "Примеры использования",
            blocks: [
              {
                type: "paragraph",
                text:
                  "Иконки помогают быстро считать смысл блока и добавляют визуальный акцент интерфейсу.",
              },
              {
                type: "paragraph",
                text:
                  "Иконка размещается внутри блока и поддерживает основной смысл заголовка.",
              },
              {
                type: "list",
                items: [
                  "чаще всего располагается в одном из углов карточки.",
                  "размер иконки подбирается так, чтобы она оставалась заметной, но не перетягивала внимание с текста.",
                  "допускается частичный выход иконки за границы контентной области.",
                  "в крупных блоках допускается использование увеличенной иконки как иллюстративного элемента.",
                ],
              },
              {
                type: "figure",
                src: brandIconsImagePaths.usageExamples,
                alt: "Примеры использования иконок в интерфейсе",
              },
            ],
          },
        ],
      },
    ],
  },
  typography: {
    slug: "typography",
    title: "Типографика",
    description: "Фирменный шрифт Inter, начертания, шкала и подключение.",
    intro:
      "Inter — фирменный шрифт дизайн-системы с поддержкой кириллицы и вариативными начертаниями.",
    sections: [
      {
        type: "content-blocks",
        id: "brand-font",
        heading: "Фирменный шрифт",
        blocks: [
          {
            type: "paragraph",
            text:
              "Наш фирменный шрифт — Inter. У шрифта большая вариативность. В нём предусмотрены различные элементы письма — глифы (знаки и буквы). Inter хорошо отображается в кириллице.",
          },
        ],
      },
      {
        type: "content-blocks",
        id: "font-weights",
        heading: "Используемые начертания",
        blocks: [
          {
            type: "paragraph",
            text: "Мы используем 3 начертания для текста: Regular, Medium и Bold.",
          },
        ],
      },
      {
        type: "typography-scale",
        id: "type-sizes",
        heading: "Размеры шрифта",
        groups: [
          { id: "type-headings", title: "Заголовки", rows: HEADING_SCALE },
          { id: "type-paragraph", title: "Наборный", rows: PARAGRAPH_SCALE },
          { id: "type-label", title: "Вспомогательный", rows: LABEL_SCALE },
        ],
      },
      {
        type: "font-setup",
        id: "font-setup",
        heading: "Подключение шрифта",
        desktopLabel: "Версия для компьютера",
        downloadHref: "https://fonts.google.com/specimen/Inter",
        downloadLabel: "Скачать шрифт для компьютера",
        cssLabel: "CSS для подключения на сайт",
        cssCode: INTER_CSS_IMPORT,
      },
    ],
  },
  color: {
    slug: "color",
    title: "Палитра",
    description: "Система цвета, градиенты и палитра для графиков.",
    intro:
      "Цвета организованы в три уровня — base, semantic и component. Ниже — правила именования, градиенты и палитра для визуализации данных.",
    sections: [
      {
        type: "color-system",
        id: "color-system",
        heading: "Система цвета",
      },
      {
        type: "color-gradients",
        id: "color-gradients",
        heading: "Градиенты",
      },
      {
        type: "color-chart-palette",
        id: "color-chart-palette",
        heading: "Палитра для графиков",
      },
    ],
  },
  "visual-style": {
    slug: "visual-style",
    title: "Визуальный стиль",
    description: "3D-изображения, фотостиль и принципы мокапов интерфейсов.",
    intro:
      "Визуальный стиль задаёт правила для 3D-иллюстраций, фотографий и стеклянных мокапов интерфейса в маркетинговых материалах и баннерах.",
    sections: [
      {
        type: "content-blocks",
        id: "3d-images",
        heading: "3D изображения",
        blocks: [
          { type: "subheading", text: "Принципы" },
          { type: "subheading", text: "Расположение объекта" },
          {
            type: "paragraph",
            text:
              "Объекты левитируют в абстрактном пространстве для усиления внимания на объекте. Камера настроена так, чтобы объект находился под углом. Камера находится на уровне или над объектом.",
          },
          { type: "subheading", text: "Освещение" },
          {
            type: "paragraph",
            text:
              "Основа стиля — общее рассеянное освещение с добавлением фиолетового цвета и акцентный луч, который состоит из трёх однотонных лучей: бело-жёлтый свет, оранжевый и красный. В одной композиции может использоваться только один луч.",
          },
          { type: "subheading", text: "Расположение акцентного луча" },
          {
            type: "paragraph",
            text:
              "Акцентный луч всегда восходит в композиции, символизируя положительную динамику (правая часть выше левой) и занимает около 20–30% от объекта. Рассеянность луча может варьироваться в зависимости от задумки.",
          },
          { type: "subheading", text: "Стабильная композиция" },
          {
            type: "paragraph",
            text:
              "Для обеспечения визуальной устойчивости объект должен содержать чётко выраженные вертикальные линии.",
          },
          { type: "subheading", text: "Материалы" },
          {
            type: "list",
            items: ["Сталь", "Стекло", "Пластик"],
          },
          { type: "subheading", text: "Примеры" },
        ],
      },
      {
        type: "content-blocks",
        id: "photo-style",
        heading: "Фотостиль",
        blocks: [
          {
            type: "list",
            items: ["Люди", "Закаты", "Крупные планы", "Природа", "Огни", "Город"],
          },
          { type: "subheading", text: "Правила подбора фото" },
          {
            type: "list",
            items: [
              "Снимайте в крупном плане, чтобы подчеркнуть детали и эмоции.",
              "Люди на фотографиях должны иметь умеренно серьёзное выражение лица.",
              "Одежда человека в кадре имеет офисный стиль, но не слишком строгий.",
              "Фотографии делаются на чёрном фоне.",
              "Для подсветки лица используется мягкий рассеянный тёплый свет (3000–4000K).",
              "Свет падает сбоку, чтобы одна половина лица была освещена лучше другой. Это сделает кадр контрастным.",
              "Правильно кадрируйте фото для усиления драматургии. Это создаст напряжение или динамику. Можете использовать правило третей.",
              "На этапе постобработки корректируйте свет и цвета, усиливайте акцент на фирменных тонах (фиолетовых и оранжевых) и сохраняйте мягкость освещения.",
              "На лицо падает акцентный луч, которого можно добиться общим затемнением фотографии и созданием маски на месте падения.",
              "Обратите внимание на детали лица и объекта. Сохраняйте чёткость изображения, но при этом поддерживайте мягкость освещения.",
            ],
          },
        ],
      },
      {
        type: "content-blocks",
        id: "interface-mockups",
        heading: "Принципы мокапов интерфейсов",
        blocks: [
          { type: "subheading", text: "Материал и свойства" },
          {
            type: "paragraph",
            text:
              "Мокапы сделаны из стекла. Материал должен быть полупрозрачным, чтобы мягко рассеивать свет и слегка размывать фоновые изображения. Это обеспечивает читаемость интерфейса и добавляет глубину композиции.",
          },
          { type: "subheading", text: "Детали" },
          {
            type: "paragraph",
            text:
              "Торцы не закругляются. Острые грани создают выразительные блики, подчеркивающие форму и добавляющие яркости в композицию. Также возможно добавление мелкой фаски для обогащения отражения.",
          },
          { type: "subheading", text: "Композиция в баннерах" },
          {
            type: "paragraph",
            text:
              "В баннерах и на главных экранах мокапы имеют дубликаты без интерфейсов и располагаются в форме веера. Это создаёт привлекательный и запоминающийся абстрактный эффект.",
          },
        ],
      },
    ],
  },

  "social-media": {
    slug: "social-media",
    title: "Соцсети",
    description: "Цвета, константы, 3D-элементы, отступы и примеры для соцсетей.",
    intro:
      "Правила оформления контента «Финам» в социальных сетях: палитра, константы макетов, 3D-элементы, сетка отступов и референсы.",
    sections: [
      {
        type: "content-blocks",
        id: "social-colors",
        heading: "Цвета",
        blocks: [],
      },
      {
        type: "content-blocks",
        id: "social-constants",
        heading: "Константы",
        blocks: [],
      },
      {
        type: "content-blocks",
        id: "social-3d",
        heading: "3D-элементы",
        blocks: [],
      },
      {
        type: "content-blocks",
        id: "social-spacing",
        heading: "Отступы",
        blocks: [],
      },
      {
        type: "content-blocks",
        id: "social-examples",
        heading: "Примеры",
        blocks: [],
      },
    ],
  },
};

export const BRAND_COLOR_SEED: BrandColorData = {
  hierarchy: {
    base: {
      title: "Base",
      description: "Примитивы без какой-либо семантики",
      tokens: [
        { name: "yellow 300", hex: "#F2D072" },
        { name: "yellow 400", hex: "#E8B94E" },
        { name: "yellow 500", hex: "#C8940A" },
      ],
    },
    semantic: {
      title: "Semantic",
      description: "Назначения переменных в системе",
      tokens: [
        { name: "bg-hover", hex: "#F2D072" },
        { name: "text-brand", hex: "#E8B94E" },
        { name: "border-active", hex: "#E8B94E" },
      ],
    },
    component: {
      title: "Component",
      description:
        "Специфичные токены. UI-элементы в продуктах, имеющие уникальные свойства",
      tokens: [
        { name: "button-bg-hover", hex: "#F2D072" },
        { name: "input-border-active", hex: "#E8B94E" },
        { name: "menu-label", hex: "#E8B94E" },
      ],
    },
    mappings: [
      { from: "yellow 300", to: "bg-hover" },
      { from: "yellow 300", to: "button-bg-hover" },
      { from: "yellow 400", to: "text-brand" },
      { from: "yellow 400", to: "border-active" },
      { from: "border-active", to: "input-border-active" },
    ],
  },
  semantics: {
    sections: [
      {
        title: "Type",
        body: "Обязательный параметр, который определяет, какой тип объекта мы красим.",
        items: [
          "bg — заливка фона",
          "text — цвета для текста",
          "icon — цвета для иконок",
          "border — разделители и обводки элементов",
          "opacity — прозрачность",
          "data — цвета для данных и графиков",
          "shadow — тени",
        ],
      },
      {
        title: "Color role",
        body: "Цвета имеют конкретное значение в зависимости от использования, а не оттенка. Например, акцентный цвет по умолчанию — brand, он может меняться в зависимости от темы или продукта.",
        items: ["base, brand, positive, negative, warning, ondark, inverse"],
      },
      {
        title: "Prominence",
        body: "Используется для создания иерархии и визуальных акцентов. Определяет интенсивность фона, текста или иконок (например, secondary и tertiary).",
        items: ["(default), secondary, tertiary"],
      },
    ],
    namingParts: [
      {
        part: "type",
        required: true,
        examples: ["bg", "text", "icon", "border", "opacity", "data", "shadow"],
      },
      {
        part: "color role",
        required: false,
        examples: ["base", "brand", "positive", "negative", "warning", "ondark", "inverse"],
      },
      {
        part: "prominence",
        required: false,
        examples: ["(default)", "secondary", "tertiary"],
      },
      {
        part: "interaction",
        required: false,
        examples: ["(default)", "hover", "active"],
      },
    ],
    examples: [
      { token: "bg-base", description: "Фон карточки по умолчанию" },
      { token: "bg-brand", description: "Акцентный фон, например бейдж «Популярно»" },
    ],
  },
  componentTokens: {
    intro: [
      "Токены для компонентов представляют уникальные и специфические дизайн-решения, связанные с конкретным элементом.",
      "Для элементов, которые обычно должны быть всегда тёмными или отличаются в продуктах/бренде, добавляется модификатор UI Element: button, input, menu и т.д.",
      "Это необязательный уровень токенов. Он нужен для создания модульной и гибкой дизайн-системы.",
    ],
    namingParts: [
      { part: "ui element", examples: ["button", "input", "toggle"] },
      { part: "-type", examples: ["-bg", "-label", "-icon", "-border"] },
      { part: "-prominence", examples: ["-primary", "-secondary", "-outline", "-ghost"] },
      { part: "-color role", examples: ["(default)", "-positive", "-negative"] },
      { part: "-interaction", examples: ["(default)", "-hover", "-pressed", "-disabled"] },
    ],
    examples: [
      { token: "input-label-active", description: "Подпись активного поля ввода" },
      { token: "input-border-active", description: "Обводка активного поля ввода" },
      {
        token: "button-bg-primary-default",
        description: "Фон primary-кнопки в состоянии по умолчанию",
      },
      { token: "spacing-m", description: "Пример токена отступа, связанного с компонентом" },
    ],
  },
  gradients: [
    {
      id: "gradient-1",
      title: "Цветовой градиент #1",
      stops: [
        { hex: "#FEDA3B", rgb: "254 218 59" },
        { hex: "#EF5541", rgb: "239 85 65" },
        { hex: "#801FDB", rgb: "128 31 219" },
        { hex: "#3C1633", rgb: "60 22 51" },
      ],
    },
    {
      id: "gradient-2",
      title: "Цветовой градиент #2",
      stops: [
        { hex: "#F8ECBC", rgb: "248 236 188" },
        { hex: "#A68B77", rgb: "166 139 119" },
        { hex: "#B67E8C", rgb: "182 126 140" },
        { hex: "#3C1633", rgb: "60 22 51" },
      ],
    },
    {
      id: "gradient-3",
      title: "Цветовой градиент #3",
      stops: [
        { hex: "#FFE7AF", rgb: "235 231 175" },
        { hex: "#F48852", rgb: "244 136 82" },
        { hex: "#D64C71", rgb: "214 76 113" },
        { hex: "#401331", rgb: "64 19 49" },
      ],
    },
    {
      id: "gradient-4",
      title: "Цветовой градиент #4",
      stops: [
        { hex: "#FFF3EC", rgb: "255 243 236" },
        { hex: "#F9DEC0", rgb: "249 222 192" },
        { hex: "#ED9FA6", rgb: "237 159 166" },
      ],
    },
    {
      id: "gradient-5",
      title: "Цветовой градиент #5",
      stops: [
        { hex: "#F0E4D8", rgb: "240 228 216" },
        { hex: "#FFB27A", rgb: "255 178 122" },
        { hex: "#9D465A", rgb: "157 70 90" },
        { hex: "#371C40", rgb: "55 28 64" },
      ],
    },
  ],
  chartPalette: {
    light: {
      id: "light",
      label: "Светлая тема",
      colors: [
        { hex: "#A22DF7", rgb: "162 45 247" },
        { hex: "#EE8F4C", rgb: "238 143 76" },
        { hex: "#F2BF4C", rgb: "242 191 76" },
        { hex: "#FF6B6E", rgb: "255 107 110" },
        { hex: "#3178D7", rgb: "49 120 215" },
        { hex: "#26C69A", rgb: "38 198 154" },
        { hex: "#E838C0", rgb: "232 56 192" },
        { hex: "#4441FC", rgb: "68 65 252" },
        { hex: "#81DA51", rgb: "129 218 81" },
        { hex: "#E64D3C", rgb: "230 77 60" },
        { hex: "#A7359B", rgb: "167 53 155" },
        { hex: "#7E57FE", rgb: "126 87 254" },
        { hex: "#8EBB1D", rgb: "142 187 28" },
        { hex: "#2DACE7", rgb: "45 172 231" },
        { hex: "#B4AEC7", rgb: "180 174 199" },
      ],
    },
    dark: {
      id: "dark",
      label: "Тёмная тема",
      colors: [
        { hex: "#9725EA", rgb: "151 37 234" },
        { hex: "#D97E3E", rgb: "217 126 62" },
        { hex: "#E8B94E", rgb: "232 185 78" },
        { hex: "#E7585C", rgb: "231 88 92" },
        { hex: "#2A79E3", rgb: "42 121 227" },
        { hex: "#22D4A3", rgb: "34 212 163" },
        { hex: "#EA38C1", rgb: "234 56 193" },
        { hex: "#4946FB", rgb: "73 70 251" },
        { hex: "#8DDD61", rgb: "141 221 97" },
        { hex: "#DF4C3C", rgb: "223 76 60" },
        { hex: "#9D3392", rgb: "157 51 146" },
        { hex: "#7A51FF", rgb: "122 81 255" },
        { hex: "#86B01D", rgb: "134 176 29" },
        { hex: "#2DA2D8", rgb: "45 162 216" },
        { hex: "#B4AEC7", rgb: "180 174 199" },
      ],
    },
  },
};

export const BRAND_PAGE_ORDER: BrandPageSlug[] = [
  "logos",
  "icons",
  "typography",
  "color",
  "visual-style",
  "social-media",
];
