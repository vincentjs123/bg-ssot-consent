# Measurements — AppHeader (shared)

Source: get_design_context on Editor Status Queue (11148:21122), Admin Status Queue (11148:21126), and other screens sharing this header.

## Header Outer Wrapper
| Property | Raw value |
|---|---|
| drop-shadow | `0px 5px 1.5px rgba(0,0,0,0.05)` |
| bg | `var(--background/bg-page, white)` |
| width | `1440px` (fixed) |

## Primary Navigation (top row)
| Property | Raw value |
|---|---|
| flex direction | row |
| align items | center |
| paddingLeft | 64px |
| paddingRight | 64px |
| paddingTop | 16px |
| paddingBottom | 16px |
| gap | 24px |

## Logo + Subtitle (left side)
| Property | Raw value |
|---|---|
| flex direction | column |
| gap | 8px |
| align items | start |
| justify content | center |
| flex | 1 0 0 |
| Logo width | 176px |
| Logo height | 20.849px |
| Subtitle font-family | Font/family/font-h2 (Barlow) |
| Subtitle font-weight | Font/weight/font-weight-h2 (300 / Light) |
| Subtitle font-size | Font/size/font-size-h2 (28px) |
| Subtitle line-height | Font/line-height/line-height-h2 (36px) |
| Subtitle letter-spacing | Font/letter-spacing/letter-spacing-h2 (-0.14px) |
| Subtitle color | var(--text/text-primary, #0C2340) |

## Profile area (right side)
| Property | Raw value |
|---|---|
| width | 523px |
| flex | row, justify-end, items-center, gap-24 |
| Profile icon size | 32×32px |
| Profile icon (Phosphor) | UserCircle |

## Secondary Navigation (tab bar)
| Property | Raw value |
|---|---|
| bg | `var(--background/bg-body, #F3F4F5)` |
| border-bottom | `1px solid var(--borders-&-dividers/border-subtle, #CACED0)` |
| height | 58px |
| paddingLeft | 64px |
| paddingRight | 64px |
| paddingTop | 8px |
| gap between tabs | 60px |

## Each Tab Item
| Property | Raw value |
|---|---|
| height | 50px |
| flex direction | column |
| align items | start |
| Tab container padding | 12px |
| Tab container gap | 8px |
| Tab container align | center, justify-center |
| Tab border-radius | rounded-tl-[2px] rounded-tr-[2px] |
| Icon size | 24×24px |
| Label font-family | Font/family/font-body (Barlow) |
| Label font-weight | Font/weight/font-weight-body-lg-regular (400) |
| Label font-size | Font/size/font-size-body-lg (16px) |
| Label line-height | Font/line-height/line-height-body-lg (24px) |
| Label color | var(--text/text-primary, #0C2340) |

## Active Tab Indicator
| Property | Raw value |
|---|---|
| height | 2px |
| bg | `var(--borders-&-dividers/border-primary, #3D4F66)` |
| width | 100% |
| position | bottom of tab |

## Tabs (in order)
| Tab | Icon file | Label |
|---|---|---|
| Test Codes | `/assets/test-kit.png` | Test Codes |
| Consents | `/assets/icon.png` | Consents |
| Payers | `/assets/insurance.png` | Payers |
| Status Queue | `/assets/queue.png` | Status Queue |
