def correct_name(name):
    name_corrections = {
        'Sergey Pavlovich': 'Sergei Pavlovich',
        'Elves Brenner': 'Elves Brener',
        'José Aldo': 'Jose Aldo',
        'Paulo Henrique Costa': 'Paulo Costa',
        'Khaos Williams': 'Kalinn Williams',
        'Tuco Tokkos': 'George Tokkos',
        'Alatengheili': 'Heili Alateng',
        'Kleydson Rodrigues': 'Kleidiso Rodrigues',
        'Alexander Romanov': 'Alexandr Romanov',
        'Elizeu Zaleski dos Santos': 'Elizeu Zaleski Dos Santos',
        'Phil Rowe': 'Philip Rowe',
        'Zachary Reese': 'Zach Reese',
        'Douglas Silva de Andrade': 'Douglas Silva',
        'Asu Almabayev': 'Assu Almabayev',
        'Melquizael Costa': 'Melquizael Conceicao',
        'Shayilan Nuerdanbieke': 'Nuerdanbieke Shayilan',
        'Timmy Cuamba': 'Timothy Cuamba',
        'Muhammad Naimov': 'Muhammadjon Naimov',
        'Kyung Ho Kang': 'Kyungho Kang',
        'ChangHo Lee': 'Chang Ho Lee',
        'Michelle Waterson-Gomez': 'Michelle Gomez',
        'Ian Garry': 'Ian Machado Garry',
        'Christian Leroy Duncan': 'Christian Duncan',
        'Jirí Prochazka': 'Jiri Prochazka',
    }

    name = name.replace('é', 'e').replace('ł', 'l').replace('á', 'a').replace('Ľ', 'L').replace('í', 'i')
    if name in name_corrections:
        return name_corrections[name]
    else:
        return name


def parse_attributes(content, key):
    attributes = {}
    for attribute in content[key]:
        name = attribute['displayName'].replace(' ', '_').lower()
        attributes[name] = attribute['value']

    return attributes