export function getUsageLevel(units) {
  if (units <= 100) return "low";
  if (units <= 300) return "moderate";
  return "high";
}

export function generateSummary(result, text) {
  const level = getUsageLevel(result.units_consumed);

  const category =
    result.tariff_category === "Domestic"
      ? text.domestic
      : result.tariff_category === "Commercial"
      ? text.commercial
      : text.industrial;

  switch (level) {
    case "low":
      return text.summaryLow
        .replace("{category}", category)
        .replace("{units}", result.units_consumed);

    case "moderate":
      return text.summaryModerate
        .replace("{category}", category)
        .replace("{units}", result.units_consumed);

    default:
      return text.summaryHigh
        .replace("{category}", category)
        .replace("{units}", result.units_consumed);
  }
}

export function generateTips(result, text) {

  const level = getUsageLevel(result.units_consumed);

  if (result.tariff_category === "Domestic") {

    if (level === "low")
      return text.domesticLowTips;

    if (level === "moderate")
      return text.domesticModerateTips;

    return text.domesticHighTips;
  }

  if (result.tariff_category === "Commercial") {

    if (level === "low")
      return text.commercialLowTips;

    if (level === "moderate")
      return text.commercialModerateTips;

    return text.commercialHighTips;
  }

  if (level === "low")
    return text.industrialLowTips;

  if (level === "moderate")
    return text.industrialModerateTips;

  return text.industrialHighTips;
}