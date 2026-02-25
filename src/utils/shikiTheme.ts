// Shiki 语言映射（VSCode languageId -> Shiki lang）
export const langMap: Record<string, string> = {
  typescriptreact: 'tsx',
  javascriptreact: 'jsx',
  plaintext: 'text',
};

// 主题配置：统一管理所有主题的显示名称和 Shiki 主题映射
export const themeConfig = [
  // VSCode 内置主题
  {
    label: 'Dark+ (默认深色)',
    value: 'dark-plus',
    vscodeNames: [
      'Default Dark+',
      'Dark+ (default dark)',
      'Visual Studio Dark',
      'Default Dark Modern',
    ],
  },
  {
    label: 'Light+ (默认浅色)',
    value: 'light-plus',
    vscodeNames: [
      'Default Light+',
      'Light+ (default light)',
      'Visual Studio Light',
      'Default Light Modern',
      'Quiet Light',
    ],
  },
  { label: 'Monokai', value: 'monokai', vscodeNames: ['Monokai', 'Monokai Dimmed'] },

  // 流行的第三方主题
  { label: 'Dracula', value: 'dracula', vscodeNames: ['Dracula Theme', 'Dracula'] },
  {
    label: 'Dracula Soft',
    value: 'dracula-soft',
    vscodeNames: ['Dracula Theme Soft', 'Dracula Soft'],
  },
  {
    label: 'One Dark Pro',
    value: 'one-dark-pro',
    vscodeNames: [
      'One Dark Pro',
      'One Dark Pro Flat',
      'One Dark Pro Darker',
      'One Dark Pro Mix',
      'One Dark Pro Night Flat',
      'Atom One Dark',
      'One Monokai',
    ],
  },
  { label: 'One Light', value: 'one-light', vscodeNames: ['Atom One Light', 'One Light'] },
  { label: 'GitHub Dark', value: 'github-dark', vscodeNames: ['GitHub Dark'] },
  {
    label: 'GitHub Dark Default',
    value: 'github-dark-default',
    vscodeNames: ['GitHub Dark Default'],
  },
  {
    label: 'GitHub Dark Dimmed',
    value: 'github-dark-dimmed',
    vscodeNames: ['GitHub Dark Dimmed'],
  },
  {
    label: 'GitHub Dark High Contrast',
    value: 'github-dark-high-contrast',
    vscodeNames: ['GitHub Dark High Contrast', 'Default High Contrast'],
  },
  { label: 'GitHub Light', value: 'github-light', vscodeNames: ['GitHub Light'] },
  {
    label: 'GitHub Light Default',
    value: 'github-light-default',
    vscodeNames: ['GitHub Light Default'],
  },
  {
    label: 'GitHub Light High Contrast',
    value: 'github-light-high-contrast',
    vscodeNames: ['GitHub Light High Contrast', 'Default High Contrast Light'],
  },
  { label: 'Nord', value: 'nord', vscodeNames: ['Nord'] },
  {
    label: 'Tokyo Night',
    value: 'tokyo-night',
    vscodeNames: ['Tokyo Night', 'Tokyo Night Storm', 'Tokyo Night Light'],
  },

  // Material 系列
  {
    label: 'Material Theme',
    value: 'material-theme',
    vscodeNames: ['Material Theme', 'Material Theme High Contrast'],
  },
  {
    label: 'Material Theme Darker',
    value: 'material-theme-darker',
    vscodeNames: ['Material Theme Darker', 'Material Theme Darker High Contrast'],
  },
  {
    label: 'Material Theme Lighter',
    value: 'material-theme-lighter',
    vscodeNames: ['Material Theme Lighter', 'Material Theme Lighter High Contrast'],
  },
  {
    label: 'Material Theme Ocean',
    value: 'material-theme-ocean',
    vscodeNames: ['Material Theme Ocean', 'Material Theme Ocean High Contrast'],
  },
  {
    label: 'Material Theme Palenight',
    value: 'material-theme-palenight',
    vscodeNames: ['Material Theme Palenight', 'Material Theme Palenight High Contrast'],
  },

  // Catppuccin 系列
  { label: 'Catppuccin Mocha', value: 'catppuccin-mocha', vscodeNames: ['Catppuccin Mocha'] },
  { label: 'Catppuccin Latte', value: 'catppuccin-latte', vscodeNames: ['Catppuccin Latte'] },
  { label: 'Catppuccin Frappé', value: 'catppuccin-frappe', vscodeNames: ['Catppuccin Frappé'] },
  {
    label: 'Catppuccin Macchiato',
    value: 'catppuccin-macchiato',
    vscodeNames: ['Catppuccin Macchiato'],
  },

  // Gruvbox 系列
  {
    label: 'Gruvbox Dark Medium',
    value: 'gruvbox-dark-medium',
    vscodeNames: ['Gruvbox Dark Medium', 'Gruvbox Material Dark'],
  },
  { label: 'Gruvbox Dark Hard', value: 'gruvbox-dark-hard', vscodeNames: ['Gruvbox Dark Hard'] },
  { label: 'Gruvbox Dark Soft', value: 'gruvbox-dark-soft', vscodeNames: ['Gruvbox Dark Soft'] },
  {
    label: 'Gruvbox Light Medium',
    value: 'gruvbox-light-medium',
    vscodeNames: ['Gruvbox Light Medium', 'Gruvbox Material Light'],
  },
  {
    label: 'Gruvbox Light Hard',
    value: 'gruvbox-light-hard',
    vscodeNames: ['Gruvbox Light Hard'],
  },
  {
    label: 'Gruvbox Light Soft',
    value: 'gruvbox-light-soft',
    vscodeNames: ['Gruvbox Light Soft'],
  },

  // Rose Pine 系列
  {
    label: 'Rosé Pine',
    value: 'rose-pine',
    vscodeNames: ['Rosé Pine', 'Rosé Pine (no italics)', 'Rose Pine'],
  },
  {
    label: 'Rosé Pine Dawn',
    value: 'rose-pine-dawn',
    vscodeNames: ['Rosé Pine Dawn', 'Rosé Pine Dawn (no italics)', 'Rose Pine Dawn'],
  },
  {
    label: 'Rosé Pine Moon',
    value: 'rose-pine-moon',
    vscodeNames: ['Rosé Pine Moon', 'Rosé Pine Moon (no italics)', 'Rose Pine Moon'],
  },

  // Vitesse 系列
  {
    label: 'Vitesse Dark',
    value: 'vitesse-dark',
    vscodeNames: ['Vitesse Dark', 'Vitesse Dark Soft'],
  },
  {
    label: 'Vitesse Light',
    value: 'vitesse-light',
    vscodeNames: ['Vitesse Light', 'Vitesse Light Soft'],
  },
  { label: 'Vitesse Black', value: 'vitesse-black', vscodeNames: ['Vitesse Black'] },

  // Everforest 系列
  { label: 'Everforest Dark', value: 'everforest-dark', vscodeNames: ['Everforest Dark'] },
  { label: 'Everforest Light', value: 'everforest-light', vscodeNames: ['Everforest Light'] },

  // Kanagawa 系列
  { label: 'Kanagawa Wave', value: 'kanagawa-wave', vscodeNames: ['Kanagawa Wave'] },
  { label: 'Kanagawa Dragon', value: 'kanagawa-dragon', vscodeNames: ['Kanagawa Dragon'] },
  { label: 'Kanagawa Lotus', value: 'kanagawa-lotus', vscodeNames: ['Kanagawa Lotus'] },

  // Horizon 系列
  {
    label: 'Horizon',
    value: 'horizon',
    vscodeNames: ['Horizon', 'Horizon Italic', 'Horizon Bold'],
  },
  {
    label: 'Horizon Bright',
    value: 'horizon-bright',
    vscodeNames: ['Horizon Bright', 'Horizon Bright Italic', 'Horizon Bright Bold'],
  },

  // 其他主题
  {
    label: 'Night Owl',
    value: 'night-owl',
    vscodeNames: ['Night Owl', 'Night Owl (No Italics)'],
  },
  {
    label: 'Night Owl Light',
    value: 'night-owl-light',
    vscodeNames: ['Night Owl Light', 'Night Owl Light (No Italics)'],
  },
  { label: 'Solarized Dark', value: 'solarized-dark', vscodeNames: ['Solarized Dark'] },
  { label: 'Solarized Light', value: 'solarized-light', vscodeNames: ['Solarized Light'] },
  {
    label: 'Ayu Dark',
    value: 'ayu-dark',
    vscodeNames: ['Ayu Dark', 'Ayu Dark Bordered'],
  },
  {
    label: 'Ayu Light',
    value: 'ayu-light',
    vscodeNames: ['Ayu Light', 'Ayu Light Bordered'],
  },
  {
    label: 'Ayu Mirage',
    value: 'ayu-mirage',
    vscodeNames: ['Ayu Mirage', 'Ayu Mirage Bordered'],
  },
  { label: "SynthWave '84", value: 'synthwave-84', vscodeNames: ["SynthWave '84"] },
  {
    label: 'Poimandres',
    value: 'poimandres',
    vscodeNames: [
      'poimandres',
      'poimandres-storm',
      'poimandres-noitalics',
      'poimandres-noitalics-storm',
    ],
  },
  { label: 'Houston', value: 'houston', vscodeNames: ['Houston'] },
  {
    label: 'Plastic',
    value: 'plastic',
    vscodeNames: ['Plastic', 'Plastic - deprioritised punctuation'],
  },
  { label: 'Vesper', value: 'vesper', vscodeNames: ['Vesper'] },
  {
    label: 'Slack Dark',
    value: 'slack-dark',
    vscodeNames: ['Slack Theme Dark Mode', 'Slack Theme Aubergine Dark', 'Slack Dark'],
  },
  {
    label: 'Slack Ochin',
    value: 'slack-ochin',
    vscodeNames: ['Slack Theme Ochin', 'Slack Ochin'],
  },
  { label: 'Min Dark', value: 'min-dark', vscodeNames: ['Min Dark'] },
  { label: 'Min Light', value: 'min-light', vscodeNames: ['Min Light'] },
  { label: 'Snazzy Light', value: 'snazzy-light', vscodeNames: ['Snazzy Light'] },
  {
    label: 'LaserWave',
    value: 'laserwave',
    vscodeNames: ['LaserWave', 'LaserWave Italic', 'LaserWave High Contrast'],
  },
  { label: 'Aurora X', value: 'aurora-x', vscodeNames: ['Aurora X'] },
  {
    label: 'Andromeda',
    value: 'andromeeda',
    vscodeNames: [
      'Andromeda',
      'Andromeda Bordered',
      'Andromeda Italic',
      'Andromeda Italic Bordered',
      'Andromeda Colorizer',
    ],
  },
  { label: 'Red', value: 'red', vscodeNames: ['Red'] },
] as const;

// 生成下拉框选项列表
export const availableThemes = themeConfig.map((theme) => ({
  label: theme.label,
  value: theme.vscodeNames[0], // 使用第一个 VSCode 名称作为 value
}));

// Shiki 所有内置主题类型
export const shikiThemes = [
  'andromeeda',
  'aurora-x',
  'ayu-dark',
  'ayu-light',
  'ayu-mirage',
  'catppuccin-frappe',
  'catppuccin-latte',
  'catppuccin-macchiato',
  'catppuccin-mocha',
  'dark-plus',
  'dracula',
  'dracula-soft',
  'everforest-dark',
  'everforest-light',
  'github-dark',
  'github-dark-default',
  'github-dark-dimmed',
  'github-dark-high-contrast',
  'github-light',
  'github-light-default',
  'github-light-high-contrast',
  'gruvbox-dark-hard',
  'gruvbox-dark-medium',
  'gruvbox-dark-soft',
  'gruvbox-light-hard',
  'gruvbox-light-medium',
  'gruvbox-light-soft',
  'horizon',
  'horizon-bright',
  'houston',
  'kanagawa-dragon',
  'kanagawa-lotus',
  'kanagawa-wave',
  'laserwave',
  'light-plus',
  'material-theme',
  'material-theme-darker',
  'material-theme-lighter',
  'material-theme-ocean',
  'material-theme-palenight',
  'min-dark',
  'min-light',
  'monokai',
  'night-owl',
  'night-owl-light',
  'nord',
  'one-dark-pro',
  'one-light',
  'plastic',
  'poimandres',
  'red',
  'rose-pine',
  'rose-pine-dawn',
  'rose-pine-moon',
  'slack-dark',
  'slack-ochin',
  'snazzy-light',
  'solarized-dark',
  'solarized-light',
  'synthwave-84',
  'tokyo-night',
  'vesper',
  'vitesse-black',
  'vitesse-dark',
  'vitesse-light',
] as const;

export type ShikiTheme = (typeof shikiThemes)[number];

// 生成 VSCode 主题到 Shiki 主题的映射表
export const themeMap: Record<string, ShikiTheme> = {} as Record<string, ShikiTheme>;
// 生成 VSCode 主题别名到标准名称的映射（用于下拉框匹配）
export const vscodeThemeNormalizeMap: Record<string, string> = {};

themeConfig.forEach((theme) => {
  const primaryName = theme.vscodeNames[0];
  theme.vscodeNames.forEach((vscodeName) => {
    themeMap[vscodeName] = theme.value as ShikiTheme;
    // 将所有别名映射到第一个标准名称
    vscodeThemeNormalizeMap[vscodeName] = primaryName;
  });
});

// 添加中文主题名映射
themeMap['夜猫子'] = 'night-owl';
themeMap['东京之夜'] = 'tokyo-night';

// 获取 Shiki 主题（使用统一的 themeMap）
export function getShikiTheme(vscodeTheme: string): ShikiTheme {
  // 先检查精确映射
  if (themeMap[vscodeTheme]) {
    return themeMap[vscodeTheme];
  }

  // 尝试模糊匹配
  const lowerTheme = vscodeTheme.toLowerCase();

  // 尝试直接匹配（转为 kebab-case）
  const kebabCase = lowerTheme.replace(/\s+/g, '-').replace(/'/g, '');
  if (shikiThemes.includes(kebabCase as ShikiTheme)) {
    return kebabCase as ShikiTheme;
  }

  // 根据关键词匹配
  // Ayu
  if (lowerTheme.includes('ayu')) {
    if (lowerTheme.includes('light')) return 'ayu-light';
    if (lowerTheme.includes('mirage')) return 'ayu-mirage';
    return 'ayu-dark';
  }

  // Horizon
  if (lowerTheme.includes('horizon')) {
    if (lowerTheme.includes('bright')) return 'horizon-bright';
    return 'horizon';
  }

  // Catppuccin
  if (lowerTheme.includes('catppuccin')) {
    if (lowerTheme.includes('latte')) return 'catppuccin-latte';
    if (lowerTheme.includes('frappe') || lowerTheme.includes('frappé')) return 'catppuccin-frappe';
    if (lowerTheme.includes('macchiato')) return 'catppuccin-macchiato';
    return 'catppuccin-mocha';
  }

  // Material
  if (lowerTheme.includes('material')) {
    if (lowerTheme.includes('darker')) return 'material-theme-darker';
    if (lowerTheme.includes('lighter')) return 'material-theme-lighter';
    if (lowerTheme.includes('ocean')) return 'material-theme-ocean';
    if (lowerTheme.includes('palenight')) return 'material-theme-palenight';
    return 'material-theme';
  }

  // Gruvbox
  if (lowerTheme.includes('gruvbox')) {
    const isLight = lowerTheme.includes('light');
    if (lowerTheme.includes('hard')) return isLight ? 'gruvbox-light-hard' : 'gruvbox-dark-hard';
    if (lowerTheme.includes('soft')) return isLight ? 'gruvbox-light-soft' : 'gruvbox-dark-soft';
    return isLight ? 'gruvbox-light-medium' : 'gruvbox-dark-medium';
  }

  // GitHub
  if (lowerTheme.includes('github')) {
    const isLight = lowerTheme.includes('light');
    if (lowerTheme.includes('high contrast') || lowerTheme.includes('high-contrast')) {
      return isLight ? 'github-light-high-contrast' : 'github-dark-high-contrast';
    }
    if (lowerTheme.includes('dimmed')) return 'github-dark-dimmed';
    if (lowerTheme.includes('default'))
      return isLight ? 'github-light-default' : 'github-dark-default';
    return isLight ? 'github-light' : 'github-dark';
  }

  // Rose Pine
  if (lowerTheme.includes('rose') || lowerTheme.includes('rosé')) {
    if (lowerTheme.includes('dawn')) return 'rose-pine-dawn';
    if (lowerTheme.includes('moon')) return 'rose-pine-moon';
    return 'rose-pine';
  }

  // Kanagawa
  if (lowerTheme.includes('kanagawa')) {
    if (lowerTheme.includes('lotus')) return 'kanagawa-lotus';
    if (lowerTheme.includes('dragon')) return 'kanagawa-dragon';
    return 'kanagawa-wave';
  }

  // Vitesse
  if (lowerTheme.includes('vitesse')) {
    if (lowerTheme.includes('light')) return 'vitesse-light';
    if (lowerTheme.includes('black')) return 'vitesse-black';
    return 'vitesse-dark';
  }

  // Everforest
  if (lowerTheme.includes('everforest')) {
    return lowerTheme.includes('light') ? 'everforest-light' : 'everforest-dark';
  }

  // Solarized
  if (lowerTheme.includes('solarized')) {
    return lowerTheme.includes('light') ? 'solarized-light' : 'solarized-dark';
  }

  // Tokyo Night
  if (lowerTheme.includes('tokyo')) {
    return 'tokyo-night';
  }

  // 通用匹配
  if (lowerTheme.includes('dracula'))
    return lowerTheme.includes('soft') ? 'dracula-soft' : 'dracula';
  if (lowerTheme.includes('monokai')) return 'monokai';
  if (lowerTheme.includes('nord')) return 'nord';
  if (lowerTheme.includes('night owl') || lowerTheme.includes('nightowl')) {
    if (lowerTheme.includes('light')) return 'night-owl-light';
    return 'night-owl';
  }
  if (lowerTheme.includes('one dark')) return 'one-dark-pro';
  if (lowerTheme.includes('one light')) return 'one-light';
  if (lowerTheme.includes('poimandres')) return 'poimandres';
  if (lowerTheme.includes('synthwave')) return 'synthwave-84';
  if (lowerTheme.includes('andromeda')) return 'andromeeda';
  if (lowerTheme.includes('slack'))
    return lowerTheme.includes('ochin') ? 'slack-ochin' : 'slack-dark';
  if (lowerTheme.includes('min ') || lowerTheme.includes('min-')) {
    return lowerTheme.includes('light') ? 'min-light' : 'min-dark';
  }

  // VSCode 内置主题 fallback
  if (lowerTheme.includes('abyss')) return 'dark-plus';
  if (lowerTheme.includes('kimbie')) return 'dark-plus';
  if (lowerTheme.includes('tomorrow night blue')) return 'dark-plus';

  // 根据 dark/light 关键词选择默认主题
  if (lowerTheme.includes('light')) return 'light-plus';
  if (lowerTheme.includes('dark')) return 'dark-plus';

  // 默认返回 dark-plus
  return 'dark-plus';
}
