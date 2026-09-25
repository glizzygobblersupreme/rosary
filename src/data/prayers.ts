// Prayer texts. Plain data so the wording can be proofread or swapped without
// touching any component. `cue` is what is shown once a prayer is marked as
// known by heart. Line breaks in `text` are preserved on screen.

export type PrayerId =
  | 'signOfCross'
  | 'creed'
  | 'ourFather'
  | 'hailMary'
  | 'gloryBe'
  | 'fatima'
  | 'hailHolyQueen'
  | 'versicle'
  | 'concluding'
  | 'stMichael'
  | 'memorare'
  | 'litany';

export interface Prayer {
  id: PrayerId;
  title: string;
  cue: string;
  text: string;
}

const list: Prayer[] = [
  {
    id: 'signOfCross',
    title: 'Sign of the Cross',
    cue: 'In the name of the Father…',
    text: 'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.',
  },
  {
    id: 'creed',
    title: 'Apostles’ Creed',
    cue: 'I believe in God, the Father almighty…',
    text:
      'I believe in God, the Father almighty, Creator of heaven and earth, ' +
      'and in Jesus Christ, his only Son, our Lord, ' +
      'who was conceived by the Holy Spirit, born of the Virgin Mary, ' +
      'suffered under Pontius Pilate, was crucified, died and was buried; ' +
      'he descended into hell; on the third day he rose again from the dead; ' +
      'he ascended into heaven, and is seated at the right hand of God the Father almighty; ' +
      'from there he will come to judge the living and the dead.\n' +
      'I believe in the Holy Spirit, the holy catholic Church, the communion of saints, ' +
      'the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.',
  },
  {
    id: 'ourFather',
    title: 'Our Father',
    cue: 'Our Father, who art in heaven…',
    text:
      'Our Father, who art in heaven, hallowed be thy name; ' +
      'thy kingdom come, thy will be done on earth as it is in heaven.\n' +
      'Give us this day our daily bread, and forgive us our trespasses, ' +
      'as we forgive those who trespass against us; ' +
      'and lead us not into temptation, but deliver us from evil. Amen.',
  },
  {
    id: 'hailMary',
    title: 'Hail Mary',
    cue: 'Hail Mary, full of grace…',
    text:
      'Hail Mary, full of grace, the Lord is with thee. ' +
      'Blessed art thou among women, and blessed is the fruit of thy womb, Jesus.\n' +
      'Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.',
  },
  {
    id: 'gloryBe',
    title: 'Glory Be',
    cue: 'Glory be to the Father…',
    text:
      'Glory be to the Father, and to the Son, and to the Holy Spirit, ' +
      'as it was in the beginning, is now, and ever shall be, world without end. Amen.',
  },
  {
    id: 'fatima',
    title: 'Fatima Prayer',
    cue: 'O my Jesus, forgive us our sins…',
    text:
      'O my Jesus, forgive us our sins, save us from the fires of hell, ' +
      'lead all souls to heaven, especially those in most need of thy mercy. Amen.',
  },
  {
    id: 'hailHolyQueen',
    title: 'Hail, Holy Queen',
    cue: 'Hail, holy Queen, Mother of mercy…',
    text:
      'Hail, holy Queen, Mother of mercy, our life, our sweetness, and our hope. ' +
      'To thee do we cry, poor banished children of Eve; ' +
      'to thee do we send up our sighs, mourning and weeping in this valley of tears.\n' +
      'Turn then, most gracious advocate, thine eyes of mercy toward us; ' +
      'and after this our exile, show unto us the blessed fruit of thy womb, Jesus.\n' +
      'O clement, O loving, O sweet Virgin Mary.',
  },
  {
    id: 'versicle',
    title: 'Versicle',
    cue: 'Pray for us, O holy Mother of God…',
    text:
      'Pray for us, O holy Mother of God,\n' +
      'that we may be made worthy of the promises of Christ.',
  },
  {
    id: 'concluding',
    title: 'Concluding Prayer',
    cue: 'O God, whose only-begotten Son…',
    text:
      'Let us pray. O God, whose only-begotten Son, by his life, death, and resurrection, ' +
      'has purchased for us the rewards of eternal life; grant, we beseech thee, ' +
      'that by meditating upon these mysteries of the most holy Rosary of the Blessed Virgin Mary, ' +
      'we may imitate what they contain and obtain what they promise, ' +
      'through the same Christ our Lord. Amen.',
  },
  {
    id: 'stMichael',
    title: 'Prayer to Saint Michael',
    cue: 'Saint Michael the Archangel, defend us in battle…',
    text:
      'Saint Michael the Archangel, defend us in battle; ' +
      'be our protection against the wickedness and snares of the devil. ' +
      'May God rebuke him, we humbly pray; and do thou, O Prince of the heavenly host, ' +
      'by the power of God, cast into hell Satan and all the evil spirits ' +
      'who prowl about the world seeking the ruin of souls. Amen.',
  },
  {
    id: 'memorare',
    title: 'Memorare',
    cue: 'Remember, O most gracious Virgin Mary…',
    text:
      'Remember, O most gracious Virgin Mary, that never was it known ' +
      'that anyone who fled to thy protection, implored thy help, ' +
      'or sought thy intercession was left unaided.\n' +
      'Inspired by this confidence, I fly unto thee, O Virgin of virgins, my Mother; ' +
      'to thee do I come, before thee I stand, sinful and sorrowful. ' +
      'O Mother of the Word Incarnate, despise not my petitions, ' +
      'but in thy mercy hear and answer me. Amen.',
  },
  {
    id: 'litany',
    title: 'Litany of Loreto',
    cue: 'Lord, have mercy. Christ, have mercy…',
    text: [
      'Lord, have mercy. Christ, have mercy. Lord, have mercy.',
      'Christ, hear us. Christ, graciously hear us.',
      '',
      'God, the Father of heaven, have mercy on us.',
      'God the Son, Redeemer of the world, have mercy on us.',
      'God the Holy Spirit, have mercy on us.',
      'Holy Trinity, one God, have mercy on us.',
      '',
      'After each title: pray for us.',
      'Holy Mary · Holy Mother of God · Holy Virgin of virgins',
      'Mother of Christ · Mother of the Church · Mother of mercy · Mother of divine grace · ' +
        'Mother of hope · Mother most pure · Mother most chaste · Mother inviolate · ' +
        'Mother undefiled · Mother most amiable · Mother most admirable · Mother of good counsel · ' +
        'Mother of our Creator · Mother of our Saviour',
      'Virgin most prudent · Virgin most venerable · Virgin most renowned · ' +
        'Virgin most powerful · Virgin most merciful · Virgin most faithful',
      'Mirror of justice · Seat of wisdom · Cause of our joy · Spiritual vessel · ' +
        'Vessel of honour · Singular vessel of devotion · Mystical rose · Tower of David · ' +
        'Tower of ivory · House of gold · Ark of the covenant · Gate of heaven · Morning star',
      'Health of the sick · Refuge of sinners · Solace of migrants · ' +
        'Comforter of the afflicted · Help of Christians',
      'Queen of angels · Queen of patriarchs · Queen of prophets · Queen of apostles · ' +
        'Queen of martyrs · Queen of confessors · Queen of virgins · Queen of all saints · ' +
        'Queen conceived without original sin · Queen assumed into heaven · ' +
        'Queen of the most holy Rosary · Queen of families · Queen of peace',
      '',
      'Lamb of God, who takes away the sins of the world, spare us, O Lord.',
      'Lamb of God, who takes away the sins of the world, graciously hear us, O Lord.',
      'Lamb of God, who takes away the sins of the world, have mercy on us.',
    ].join('\n'),
  },
];

export const PRAYERS = Object.fromEntries(list.map((p) => [p.id, p])) as Record<PrayerId, Prayer>;

/** Prayers offered as "I know this by heart" toggles, in the order they are met. */
export const LEARNABLE: PrayerId[] = [
  'signOfCross',
  'creed',
  'ourFather',
  'hailMary',
  'gloryBe',
  'fatima',
  'hailHolyQueen',
  'concluding',
];
