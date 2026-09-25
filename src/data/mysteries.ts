// The twenty mysteries. Scripture is quoted from the Douay-Rheims Bible
// (public domain). Plain data: edit freely.

export type SetId = 'joyful' | 'luminous' | 'sorrowful' | 'glorious';

export interface Mystery {
  title: string;
  fruit: string;
  scripture: string;
  citation: string;
  meditation: string;
}

export interface MysterySet {
  id: SetId;
  name: string;
  adjective: string;
  mysteries: Mystery[];
}

export const ORDINALS = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];

export const SETS: Record<SetId, MysterySet> = {
  joyful: {
    id: 'joyful',
    name: 'The Joyful Mysteries',
    adjective: 'Joyful',
    mysteries: [
      {
        title: 'The Annunciation',
        fruit: 'Humility',
        scripture:
          'Hail, full of grace, the Lord is with thee: blessed art thou among women. … ' +
          'And Mary said: Behold the handmaid of the Lord; be it done to me according to thy word.',
        citation: 'Luke 1:28, 38',
        meditation:
          'The angel Gabriel asks Mary to become the Mother of God. She does not understand ' +
          'everything, yet she gives her whole yes. Ask for a heart that trusts God before it sees the way.',
      },
      {
        title: 'The Visitation',
        fruit: 'Love of neighbour',
        scripture:
          'When Elizabeth heard the salutation of Mary, the infant leaped in her womb. ' +
          'And Elizabeth was filled with the Holy Ghost: and she cried out with a loud voice, and said: ' +
          'Blessed art thou among women, and blessed is the fruit of thy womb.',
        citation: 'Luke 1:41–42',
        meditation:
          'Carrying Christ within her, Mary hurries across the hill country to help her cousin. ' +
          'Whoever carries Jesus is moved to serve. Think of someone who needs you to come to them.',
      },
      {
        title: 'The Nativity',
        fruit: 'Poverty of spirit',
        scripture:
          'And she brought forth her firstborn son, and wrapped him up in swaddling clothes, ' +
          'and laid him in a manger; because there was no room for them in the inn.',
        citation: 'Luke 2:7',
        meditation:
          'The Creator of the world is born in a stable and laid where animals feed. ' +
          'God chooses littleness to reach us. Ask to be free of whatever crowds him out of your life.',
      },
      {
        title: 'The Presentation in the Temple',
        fruit: 'Obedience',
        scripture:
          'They carried him to Jerusalem, to present him to the Lord. … ' +
          'And Simeon said to Mary his mother: Behold this child is set for the fall, ' +
          'and for the resurrection of many in Israel … and thy own soul a sword shall pierce.',
        citation: 'Luke 2:22, 34–35',
        meditation:
          'Mary and Joseph keep the Law and offer their Son back to the Father. ' +
          'Simeon sees the salvation he waited a lifetime for, and foretells the cost. ' +
          'Offer God what is dearest to you.',
      },
      {
        title: 'The Finding in the Temple',
        fruit: 'Joy in finding Jesus',
        scripture:
          'After three days, they found him in the temple, sitting in the midst of the doctors, ' +
          'hearing them, and asking them questions. … And he said to them: How is it that you sought me? ' +
          'Did you not know, that I must be about my father’s business?',
        citation: 'Luke 2:46, 49',
        meditation:
          'For three days Mary and Joseph search in sorrow, and find Jesus in his Father’s house. ' +
          'When he seems lost to you, look for him where he has promised to be.',
      },
    ],
  },
  luminous: {
    id: 'luminous',
    name: 'The Luminous Mysteries',
    adjective: 'Luminous',
    mysteries: [
      {
        title: 'The Baptism in the Jordan',
        fruit: 'Openness to the Holy Spirit',
        scripture:
          'And Jesus being baptized, forthwith came out of the water: and lo, the heavens were opened to him: ' +
          'and he saw the Spirit of God descending as a dove, and coming upon him. ' +
          'And behold a voice from heaven, saying: This is my beloved Son, in whom I am well pleased.',
        citation: 'Matthew 3:16–17',
        meditation:
          'The sinless one steps into the water among sinners, and the Father names him his beloved Son. ' +
          'In your own baptism the same words were spoken over you. Live today as a beloved child of God.',
      },
      {
        title: 'The Wedding at Cana',
        fruit: 'To Jesus through Mary',
        scripture:
          'His mother saith to the waiters: Whatsoever he shall say to you, do ye. … ' +
          'This beginning of miracles did Jesus in Cana of Galilee; and manifested his glory, ' +
          'and his disciples believed in him.',
        citation: 'John 2:5, 11',
        meditation:
          'Mary notices the need before anyone asks, brings it to her Son, and tells the servants to obey him. ' +
          'She does the same for you. Bring her what has run dry.',
      },
      {
        title: 'The Proclamation of the Kingdom',
        fruit: 'Repentance and trust in God',
        scripture:
          'The time is accomplished, and the kingdom of God is at hand: repent, and believe the gospel.',
        citation: 'Mark 1:15',
        meditation:
          'Jesus goes from town to town forgiving sins, healing, and calling everyone to conversion. ' +
          'The kingdom begins wherever he is allowed to reign. What is he asking you to turn from?',
      },
      {
        title: 'The Transfiguration',
        fruit: 'Desire for holiness',
        scripture:
          'And he was transfigured before them. And his face did shine as the sun: ' +
          'and his garments became white as snow. … And lo, a voice out of the cloud, saying: ' +
          'This is my beloved Son, in whom I am well pleased: hear ye him.',
        citation: 'Matthew 17:2, 5',
        meditation:
          'On the mountain the apostles glimpse the glory hidden in Jesus, to strengthen them for the Cross. ' +
          'Hold on to the moments of light God has given you; they are meant for the dark days.',
      },
      {
        title: 'The Institution of the Eucharist',
        fruit: 'Adoration',
        scripture:
          'And taking bread, he gave thanks, and brake; and gave to them, saying: ' +
          'This is my body, which is given for you. Do this for a commemoration of me.',
        citation: 'Luke 22:19',
        meditation:
          'On the night he is betrayed, Jesus gives himself entirely, body and blood, to remain with us always. ' +
          'Think of your next Communion, and thank him for staying.',
      },
    ],
  },
  sorrowful: {
    id: 'sorrowful',
    name: 'The Sorrowful Mysteries',
    adjective: 'Sorrowful',
    mysteries: [
      {
        title: 'The Agony in the Garden',
        fruit: 'Sorrow for sin',
        scripture:
          'Father, if thou wilt, remove this chalice from me: but yet not my will, but thine be done. … ' +
          'And his sweat became as drops of blood, trickling down upon the ground.',
        citation: 'Luke 22:42, 44',
        meditation:
          'Jesus sees every sin he is about to carry, and his friends sleep. He prays the harder. ' +
          'Stay awake with him for this decade, and place your will in the Father’s hands.',
      },
      {
        title: 'The Scourging at the Pillar',
        fruit: 'Purity',
        scripture:
          'Then therefore, Pilate took Jesus, and scourged him. … ' +
          'He was wounded for our iniquities, he was bruised for our sins … and by his bruises we are healed.',
        citation: 'John 19:1; Isaiah 53:5',
        meditation:
          'Pilate knows Jesus is innocent and has him scourged anyway. Christ accepts in his body ' +
          'the price of our sins of the flesh. Ask for self-control and a clean heart.',
      },
      {
        title: 'The Crowning with Thorns',
        fruit: 'Moral courage',
        scripture:
          'And platting a crown of thorns, they put it upon his head, and a reed in his right hand. ' +
          'And bowing the knee before him, they mocked him, saying: Hail, king of the Jews.',
        citation: 'Matthew 27:29',
        meditation:
          'The King of the universe is mocked as a fool and does not answer back. ' +
          'Ask for the courage to be faithful when faith is laughed at.',
      },
      {
        title: 'The Carrying of the Cross',
        fruit: 'Patience',
        scripture:
          'And bearing his own cross, he went forth to that place which is called Calvary, ' +
          'but in Hebrew Golgotha.',
        citation: 'John 19:17',
        meditation:
          'Jesus falls and rises, meets his Mother, accepts Simon’s help. He does not put the Cross down. ' +
          'Name the cross you carry today and take it up beside him.',
      },
      {
        title: 'The Crucifixion',
        fruit: 'Perseverance',
        scripture:
          'And Jesus crying with a loud voice, said: Father, into thy hands I commend my spirit. ' +
          'And saying this, he gave up the ghost.',
        citation: 'Luke 23:46',
        meditation:
          'For three hours Jesus hangs on the Cross. He forgives his executioners, gives us his Mother, ' +
          'and dies for love of you. Stand with Mary and look at him.',
      },
    ],
  },
  glorious: {
    id: 'glorious',
    name: 'The Glorious Mysteries',
    adjective: 'Glorious',
    mysteries: [
      {
        title: 'The Resurrection',
        fruit: 'Faith',
        scripture:
          'Be not affrighted; you seek Jesus of Nazareth, who was crucified: ' +
          'he is risen, he is not here, behold the place where they laid him.',
        citation: 'Mark 16:6',
        meditation:
          'The tomb is empty. Death, which seemed to have the last word, has lost. ' +
          'Let the risen Christ into whatever in your life seems sealed and finished.',
      },
      {
        title: 'The Ascension',
        fruit: 'Hope',
        scripture:
          'And the Lord Jesus, after he had spoken to them, was taken up into heaven, ' +
          'and sitteth on the right hand of God.',
        citation: 'Mark 16:19',
        meditation:
          'Jesus returns to the Father, taking our human nature into heaven, and goes to prepare a place for us. ' +
          'Lift your eyes from today’s worries to where you are headed.',
      },
      {
        title: 'The Descent of the Holy Spirit',
        fruit: 'Love of God',
        scripture:
          'And they were all filled with the Holy Ghost, and they began to speak with divers tongues, ' +
          'according as the Holy Ghost gave them to speak.',
        citation: 'Acts 2:4',
        meditation:
          'Gathered in prayer with Mary, frightened men are set on fire and sent out to the whole world. ' +
          'Ask the Holy Spirit for the gift you most need.',
      },
      {
        title: 'The Assumption',
        fruit: 'Grace of a happy death',
        scripture:
          'Behold from henceforth all generations shall call me blessed. ' +
          'Because he that is mighty, hath done great things to me; and holy is his name.',
        citation: 'Luke 1:48–49',
        meditation:
          'At the end of her earthly life Mary is taken, body and soul, into heaven. ' +
          'What God has done for her he promises to all who are faithful. Entrust to her the hour of your death.',
      },
      {
        title: 'The Coronation of Mary',
        fruit: 'Trust in Mary’s intercession',
        scripture:
          'And a great sign appeared in heaven: A woman clothed with the sun, ' +
          'and the moon under her feet, and on her head a crown of twelve stars.',
        citation: 'Apocalypse 12:1',
        meditation:
          'The handmaid of the Lord is crowned Queen of heaven and earth, and she is your mother. ' +
          'Place your intentions in her hands with confidence.',
      },
    ],
  },
};
