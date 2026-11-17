// The lists of regions and languages come from https://stackoverflow.com/a/57102881

function weekStart(
  region: string,
  language: string,
): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
  const regionSat = 'AEAFBHDJDZEGIQIRJOKWLYOMQASDSY'.match(
    /../g,
  ) as RegExpMatchArray;

  const regionSun =
    'AGARASAUBDBRBSBTBWBZCACNCODMDOETGTGUHKHNIDILINJMJPKEKHKRLAMHMMMOMTMXMZNINPPAPEPHPKPRPTPYSASGSVTHTTTWUMUSVEVIWSYEZAZW'.match(
      /../g,
    ) as RegExpMatchArray;

  const languageSat = ['ar', 'arq', 'arz', 'fa'];

  const languageSun =
    'amasbndzengnguhehiidjajvkmknkolomhmlmrmtmyneomorpapssdsmsnsutatethtnurzhzu'.match(
      /../g,
    ) as RegExpMatchArray;

  return region
    ? regionSun.includes(region)
      ? 0
      : regionSat.includes(region)
        ? 6
        : 1
    : languageSun.includes(language)
      ? 0
      : languageSat.includes(language)
        ? 6
        : 1;
}

/**
 * The first day of the week for a BCP 47 language tag, as the `weekStartsOn`
 * of date-fns: 0 is Sunday, 1 is Monday, 6 is Saturday. A tag with a region
 * ('en-GB') uses the region, a tag without a region ('en') uses the language.
 */
export function weekStartForLocale(locale: string) {
  const parts = locale.match(
    /^([a-z]{2,3})(?:-([a-z]{3})(?=$|-))?(?:-([a-z]{4})(?=$|-))?(?:-([a-z]{2}|\d{3})(?=$|-))?/i,
  );

  if (!parts) {
    return 1;
  }

  return weekStart(parts[4] ?? '', parts[1]);
}
