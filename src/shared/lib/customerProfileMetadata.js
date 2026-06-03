const COUNTRY_METADATA = [
  ['AF', 'Afghan', '+93'],
  ['AL', 'Albanian', '+355'],
  ['DZ', 'Algerian', '+213'],
  ['AD', 'Andorran', '+376'],
  ['AO', 'Angolan', '+244'],
  ['AG', 'Antiguan and Barbudan', '+1'],
  ['AR', 'Argentine', '+54'],
  ['AM', 'Armenian', '+374'],
  ['AU', 'Australian', '+61'],
  ['AT', 'Austrian', '+43'],
  ['AZ', 'Azerbaijani', '+994'],
  ['BS', 'Bahamian', '+1'],
  ['BH', 'Bahraini', '+973'],
  ['BD', 'Bangladeshi', '+880'],
  ['BB', 'Barbadian', '+1'],
  ['BY', 'Belarusian', '+375'],
  ['BE', 'Belgian', '+32'],
  ['BZ', 'Belizean', '+501'],
  ['BJ', 'Beninese', '+229'],
  ['BT', 'Bhutanese', '+975'],
  ['BO', 'Bolivian', '+591'],
  ['BA', 'Bosnian and Herzegovinian', '+387'],
  ['BW', 'Botswanan', '+267'],
  ['BR', 'Brazilian', '+55'],
  ['BN', 'Bruneian', '+673'],
  ['BG', 'Bulgarian', '+359'],
  ['BF', 'Burkinabe', '+226'],
  ['BI', 'Burundian', '+257'],
  ['CV', 'Cape Verdean', '+238'],
  ['KH', 'Cambodian', '+855'],
  ['CM', 'Cameroonian', '+237'],
  ['CA', 'Canadian', '+1'],
  ['CF', 'Central African', '+236'],
  ['TD', 'Chadian', '+235'],
  ['CL', 'Chilean', '+56'],
  ['CN', 'Chinese', '+86'],
  ['CO', 'Colombian', '+57'],
  ['KM', 'Comoran', '+269'],
  ['CG', 'Congolese', '+242'],
  ['CD', 'Congolese (DRC)', '+243'],
  ['CR', 'Costa Rican', '+506'],
  ['CI', 'Ivorian', '+225'],
  ['HR', 'Croatian', '+385'],
  ['CU', 'Cuban', '+53'],
  ['CY', 'Cypriot', '+357'],
  ['CZ', 'Czech', '+420'],
  ['DK', 'Danish', '+45'],
  ['DJ', 'Djiboutian', '+253'],
  ['DM', 'Dominican', '+1'],
  ['DO', 'Dominican (Dominican Republic)', '+1'],
  ['EC', 'Ecuadorian', '+593'],
  ['EG', 'Egyptian', '+20'],
  ['SV', 'Salvadoran', '+503'],
  ['GQ', 'Equatorial Guinean', '+240'],
  ['ER', 'Eritrean', '+291'],
  ['EE', 'Estonian', '+372'],
  ['SZ', 'Eswatini', '+268'],
  ['ET', 'Ethiopian', '+251'],
  ['FJ', 'Fijian', '+679'],
  ['FI', 'Finnish', '+358'],
  ['FR', 'French', '+33'],
  ['GA', 'Gabonese', '+241'],
  ['GM', 'Gambian', '+220'],
  ['GE', 'Georgian', '+995'],
  ['DE', 'German', '+49'],
  ['GH', 'Ghanaian', '+233'],
  ['GR', 'Greek', '+30'],
  ['GD', 'Grenadian', '+1'],
  ['GT', 'Guatemalan', '+502'],
  ['GN', 'Guinean', '+224'],
  ['GW', 'Bissau-Guinean', '+245'],
  ['GY', 'Guyanese', '+592'],
  ['HT', 'Haitian', '+509'],
  ['HN', 'Honduran', '+504'],
  ['HU', 'Hungarian', '+36'],
  ['IS', 'Icelandic', '+354'],
  ['IN', 'Indian', '+91'],
  ['ID', 'Indonesian', '+62'],
  ['IR', 'Iranian', '+98'],
  ['IQ', 'Iraqi', '+964'],
  ['IE', 'Irish', '+353'],
  ['IL', 'Israeli', '+972'],
  ['IT', 'Italian', '+39'],
  ['JM', 'Jamaican', '+1'],
  ['JP', 'Japanese', '+81'],
  ['JO', 'Jordanian', '+962'],
  ['KZ', 'Kazakh', '+7'],
  ['KE', 'Kenyan', '+254'],
  ['KI', 'I-Kiribati', '+686'],
  ['KP', 'North Korean', '+850'],
  ['KR', 'South Korean', '+82'],
  ['KW', 'Kuwaiti', '+965'],
  ['KG', 'Kyrgyz', '+996'],
  ['LA', 'Laotian', '+856'],
  ['LV', 'Latvian', '+371'],
  ['LB', 'Lebanese', '+961'],
  ['LS', 'Basotho', '+266'],
  ['LR', 'Liberian', '+231'],
  ['LY', 'Libyan', '+218'],
  ['LI', 'Liechtensteiner', '+423'],
  ['LT', 'Lithuanian', '+370'],
  ['LU', 'Luxembourger', '+352'],
  ['MG', 'Malagasy', '+261'],
  ['MW', 'Malawian', '+265'],
  ['MY', 'Malaysian', '+60'],
  ['MV', 'Maldivian', '+960'],
  ['ML', 'Malian', '+223'],
  ['MT', 'Maltese', '+356'],
  ['MH', 'Marshallese', '+692'],
  ['MR', 'Mauritanian', '+222'],
  ['MU', 'Mauritian', '+230'],
  ['MX', 'Mexican', '+52'],
  ['FM', 'Micronesian', '+691'],
  ['MD', 'Moldovan', '+373'],
  ['MC', 'Monacan', '+377'],
  ['MN', 'Mongolian', '+976'],
  ['ME', 'Montenegrin', '+382'],
  ['MA', 'Moroccan', '+212'],
  ['MZ', 'Mozambican', '+258'],
  ['MM', 'Myanmar', '+95'],
  ['NA', 'Namibian', '+264'],
  ['NR', 'Nauruan', '+674'],
  ['NP', 'Nepalese', '+977'],
  ['NL', 'Dutch', '+31'],
  ['NZ', 'New Zealander', '+64'],
  ['NI', 'Nicaraguan', '+505'],
  ['NE', 'Nigerien', '+227'],
  ['NG', 'Nigerian', '+234'],
  ['MK', 'Macedonian', '+389'],
  ['NO', 'Norwegian', '+47'],
  ['OM', 'Omani', '+968'],
  ['PK', 'Pakistani', '+92'],
  ['PW', 'Palauan', '+680'],
  ['PS', 'Palestinian', '+970'],
  ['PA', 'Panamanian', '+507'],
  ['PG', 'Papua New Guinean', '+675'],
  ['PY', 'Paraguayan', '+595'],
  ['PE', 'Peruvian', '+51'],
  ['PH', 'Filipino', '+63'],
  ['PL', 'Polish', '+48'],
  ['PT', 'Portuguese', '+351'],
  ['QA', 'Qatari', '+974'],
  ['RO', 'Romanian', '+40'],
  ['RU', 'Russian', '+7'],
  ['RW', 'Rwandan', '+250'],
  ['KN', 'Kittitian or Nevisian', '+1'],
  ['LC', 'Saint Lucian', '+1'],
  ['VC', 'Vincentian', '+1'],
  ['WS', 'Samoan', '+685'],
  ['SM', 'Sammarinese', '+378'],
  ['ST', 'Sao Tomean', '+239'],
  ['SA', 'Saudi', '+966'],
  ['SN', 'Senegalese', '+221'],
  ['RS', 'Serbian', '+381'],
  ['SC', 'Seychellois', '+248'],
  ['SL', 'Sierra Leonean', '+232'],
  ['SG', 'Singaporean', '+65'],
  ['SK', 'Slovak', '+421'],
  ['SI', 'Slovenian', '+386'],
  ['SB', 'Solomon Islander', '+677'],
  ['SO', 'Somali', '+252'],
  ['ZA', 'South African', '+27'],
  ['SS', 'South Sudanese', '+211'],
  ['ES', 'Spanish', '+34'],
  ['LK', 'Sri Lankan', '+94'],
  ['SD', 'Sudanese', '+249'],
  ['SR', 'Surinamese', '+597'],
  ['SE', 'Swedish', '+46'],
  ['CH', 'Swiss', '+41'],
  ['SY', 'Syrian', '+963'],
  ['TJ', 'Tajik', '+992'],
  ['TZ', 'Tanzanian', '+255'],
  ['TH', 'Thai', '+66'],
  ['TL', 'Timorese', '+670'],
  ['TG', 'Togolese', '+228'],
  ['TO', 'Tongan', '+676'],
  ['TT', 'Trinidadian or Tobagonian', '+1'],
  ['TN', 'Tunisian', '+216'],
  ['TR', 'Turkish', '+90'],
  ['TM', 'Turkmen', '+993'],
  ['TV', 'Tuvaluan', '+688'],
  ['UG', 'Ugandan', '+256'],
  ['UA', 'Ukrainian', '+380'],
  ['AE', 'Emirati', '+971'],
  ['GB', 'British', '+44'],
  ['US', 'American', '+1'],
  ['UY', 'Uruguayan', '+598'],
  ['UZ', 'Uzbek', '+998'],
  ['VU', 'Ni-Vanuatu', '+678'],
  ['VA', 'Vatican', '+379'],
  ['VE', 'Venezuelan', '+58'],
  ['VN', 'Vietnamese', '+84'],
  ['YE', 'Yemeni', '+967'],
  ['ZM', 'Zambian', '+260'],
  ['ZW', 'Zimbabwean', '+263'],
]

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })

const COUNTRY_OPTIONS = COUNTRY_METADATA.map(([countryCode, nationality, dialCode]) => {
  const countryName = regionNames.of(countryCode) || nationality

  return {
    value: nationality,
    label: countryName,
    countryCode,
    countryName,
    nationality,
    dialCode,
  }
})

const STATIC_COUNTRY_NAME_LOOKUP = new Map(COUNTRY_OPTIONS.flatMap((option) => ([
  [option.countryName.toLowerCase(), option.countryName],
  [option.nationality.toLowerCase(), option.countryName],
])))

export const NATIONALITY_OPTIONS = COUNTRY_OPTIONS.map(({ value, label, countryCode, countryName }) => ({
  value,
  label,
  countryCode,
  countryName,
}))

export const DEFAULT_COUNTRY_REFERENCE_OPTIONS = COUNTRY_OPTIONS.map(({ countryName, countryCode, dialCode }) => ({
  id: countryCode,
  value: countryName,
  label: countryName,
  countryCode,
  countryName,
  iso2: countryCode,
  phoneCode: dialCode,
  status: 'active',
}))

export const DEFAULT_PHONE_COUNTRY_CODE = '+971'

export const normalizeCountryReferences = (countries = []) => (Array.isArray(countries) ? countries : [])
  .map((country) => {
    const countryName = String(country?.name || country?.label || '').trim()
    const phoneCode = String(country?.phone_code || country?.phoneCode || '').trim()
    const iso2 = String(country?.iso2 || '').trim().toUpperCase()

    if (!countryName || !iso2) return null

    return {
      id: country?.id || iso2,
      value: countryName,
      label: countryName,
      countryCode: iso2,
      countryName,
      iso2,
      iso3: country?.iso3 || '',
      phoneCode,
      currencyCode: country?.currency_code || '',
      flag: country?.flag || '',
      flagCode: country?.flag_code || '',
      status: country?.status || 'active',
    }
  })
  .filter(Boolean)

export const buildCountryNameOptions = ({ countries = [], existingValues = [] } = {}) => {
  const options = normalizeCountryReferences(countries)
  const seenValues = new Set(options.map((option) => option.value.toLowerCase()))
  const unmatchedOptions = existingValues
    .map((value) => String(value || '').trim())
    .filter((value) => value && !seenValues.has(value.toLowerCase()))
    .map((value) => ({ id: `saved-${value}`, value, label: value, countryCode: '', countryName: value, unmatched: true }))

  return [...unmatchedOptions, ...options]
}

export const buildCountryNameLookup = (countries = []) => new Map([
  ...Array.from(STATIC_COUNTRY_NAME_LOOKUP.entries()),
  ...normalizeCountryReferences(countries).flatMap((option) => ([[option.countryName.toLowerCase(), option.countryName]])),
])

export const getCountryNameLabel = (value = '', countries = []) => {
  const normalizedValue = String(value || '').trim()
  if (!normalizedValue) return ''

  return buildCountryNameLookup(countries).get(normalizedValue.toLowerCase()) || normalizedValue
}

export const buildPhoneCountryCodeOptions = ({ countries = [], existingValues = [] } = {}) => {
  const options = normalizeCountryReferences(countries)
    .filter((country) => country.phoneCode)
    .map((country) => ({
      value: country.phoneCode,
      label: `${country.phoneCode} · ${country.countryName}`,
      countryCode: country.iso2,
      countryName: country.countryName,
      key: `${country.iso2}-${country.phoneCode}`,
    }))
    .sort((left, right) => left.label.localeCompare(right.label))

  const seenKeys = new Set(options.map((option) => `${option.countryCode}-${option.value}`))
  const unmatchedOptions = existingValues
    .map((value) => String(value || '').trim())
    .filter(Boolean)
    .filter((value) => !options.some((option) => option.value === value))
    .map((value) => ({ value, label: value, countryCode: `saved-${value}`, countryName: value, key: `saved-${value}`, unmatched: true }))
    .filter((option) => {
      if (seenKeys.has(option.key)) return false
      seenKeys.add(option.key)
      return true
    })

  return [...unmatchedOptions, ...options]
}

export const PHONE_COUNTRY_CODE_OPTIONS = buildPhoneCountryCodeOptions({ countries: DEFAULT_COUNTRY_REFERENCE_OPTIONS })

export const COUNTRY_NAME_OPTIONS = buildCountryNameOptions({ countries: DEFAULT_COUNTRY_REFERENCE_OPTIONS })

export const parsePhoneNumber = (phone = '', phoneCountryCodeOptions = PHONE_COUNTRY_CODE_OPTIONS) => {
  const normalizedPhone = String(phone || '').trim()
  if (!normalizedPhone) {
    return { countryCode: DEFAULT_PHONE_COUNTRY_CODE, number: '' }
  }

  const suppliedPhoneCodeOptions = Array.isArray(phoneCountryCodeOptions) ? phoneCountryCodeOptions : []
  const phoneCodeValues = [...new Set([
    ...suppliedPhoneCodeOptions.map((option) => option.value),
    ...PHONE_COUNTRY_CODE_OPTIONS.map((option) => option.value),
    DEFAULT_PHONE_COUNTRY_CODE,
  ].filter(Boolean))].sort((left, right) => right.length - left.length)
  const compactPhone = normalizedPhone.replace(/\s+/g, ' ')
  const matchedCode = phoneCodeValues.find((code) => compactPhone.startsWith(code))

  if (matchedCode) {
    return {
      countryCode: matchedCode,
      number: compactPhone.slice(matchedCode.length).trim(),
    }
  }

  return {
    countryCode: DEFAULT_PHONE_COUNTRY_CODE,
    number: normalizedPhone.replace(/^\+/, '').trim(),
  }
}

export const buildPhoneNumber = ({ countryCode, number }) => {
  const trimmedNumber = String(number || '').trim()
  if (!trimmedNumber) return ''

  const normalizedCode = String(countryCode || DEFAULT_PHONE_COUNTRY_CODE).trim()
  return `${normalizedCode} ${trimmedNumber}`.trim()
}
