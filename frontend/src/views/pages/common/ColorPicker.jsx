import * as React from 'react';
import {
    Button,
    Form,
    Grid,
    GridColumn,
    Header,
    Segment,
    Tab,
    Table,
} from 'semantic-ui-react';
import {RgbaColorPicker} from 'react-colorful';
import colorPalettes from 'nice-color-palettes';
import hexRgb from 'hex-rgb';
import rgbHex from 'rgb-hex';
import _ from 'lodash';
import isDarkColor from 'is-dark-color';
import utils from '../../../core/util/helper';
import * as constants from '../../../core/util/constants.js';
import colorScales from '../../../core/util/color_scale';
import webSafeColors from '../../../core/util/web_safe_colors';
import colorTable from '../../../core/util/color_table';
import LayoutResolver from "../../layouts/layout-resolver.jsx";

const rgbToHex = (r, g, b) =>
    `#${[r, g, b]
        .map((x) => {
            const hex = x.toString(16);
            return hex.length === 1 ? `0${hex}` : hex;
        })
        .join('')}`;

const onAddToFavorites = (hex) => {

    if (hex === '') return;
    let storedColors = JSON.parse(localStorage.getItem(constants.KEY_COLOR_PICKER_FAVORITES));
    if (storedColors === undefined || storedColors === null) storedColors = [];
    if (_.findIndex(storedColors, (c) => c === hex) === -1)
        storedColors.push(hex);
    localStorage.setItem(constants.KEY_COLOR_PICKER_FAVORITES, JSON.stringify(storedColors));
    utils.toast.success('Add to favorites successfully!');
};

function TabColorPicker() {
    const [hexColor, setHexColor] = React.useState('#000000');
    const [rgbaColor, setRgbaColor] = React.useState({r: 0, g: 0, b: 0, a: 1});
    const [rgbaStringColor, setRgbaStringColor] =
        React.useState('rgb(0, 0, 0, 1)');

    const onColorChange = (newColor) => {
        const hex = rgbToHex(newColor.r, newColor.g, newColor.b);
        setHexColor(hex);
        setRgbaColor(newColor);
        setRgbaStringColor(
            `rgba(${newColor.r}, ${newColor.g}, ${newColor.b}, ${newColor.a})`
        );
    };

    const onHexColorChange = (newColor) => {
        setHexColor(newColor);
        try {
            const rgba = hexRgb(newColor);
            setRgbaColor({r: rgba.red, g: rgba.green, b: rgba.blue, a: rgba.alpha});
            setRgbaStringColor(
                `rgba(${rgba.red}, ${rgba.green}, ${rgba.blue}, ${rgba.alpha})`
            );
        } catch (error) {
            // TO-DO:
        }
    };

    const onRgbaStringColorChange = (newColor) => {
        setRgbaStringColor(newColor);
        try {
            const hex = `#${rgbHex(newColor)}`;
            setHexColor(hex);
            const rgba = hexRgb(hex);
            setRgbaColor({r: rgba.red, g: rgba.green, b: rgba.blue, a: rgba.alpha});
        } catch (error) {
            // TO-DO:
        }
    };

    const onCopyHex = () => {
        if (hexColor === '') return;
        utils.copy(hexColor);
        utils.toast.success('Hex value copied!');
    };

    const onCopyRgb = () => {
        if (rgbaStringColor === '') return;
        utils.copy(rgbaStringColor);
        utils.toast.success('RGBA value copied!');
    };

    const [colors, setColors] = React.useState([]);

    const hexToRgb = (hex) => {
        if (hex === '') return '';
        const rgb = hexRgb(hex);
        return `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
    };

    const onRemove = (hex) => {
        const storedColors = JSON.parse(localStorage.getItem(
            constants.KEY_COLOR_PICKER_FAVORITES
        ));
        if (storedColors === undefined || storedColors === null) return;
        _.remove(storedColors, (c) => c === hex);
        localStorage.setItem(constants.KEY_COLOR_PICKER_FAVORITES, JSON.stringify(storedColors));
        setColors(storedColors);
    };

    const reloadFavorites = () => {
        const storedColors = JSON.parse(localStorage.getItem(constants.KEY_COLOR_PICKER_FAVORITES));
        if (storedColors !== undefined && storedColors !== null) {
            setColors(Array.isArray(storedColors)  ? storedColors : [storedColors])
        }

    };

    React.useEffect(() => {
        reloadFavorites();
        return function cleanup() {
            //
        };
    }, []);

    return (
        <Tab.Pane>
            <Segment basic>
                <Grid columns="2">
                    <GridColumn>
                        <RgbaColorPicker color={rgbaColor} onChange={onColorChange}/>
                    </GridColumn>
                    <GridColumn>
                        <div
                            className="color-value"
                            style={{borderLeftColor: rgbaStringColor}}
                        >
                            Current color is
                        </div>
                        <Form>
                            <Form.Input
                                inline
                                onChange={(e) => onHexColorChange(e.currentTarget.value)}
                                action={{icon: 'copy', onClick: onCopyHex}}
                                value={hexColor}
                            />
                            <Form.Input
                                inline
                                onChange={(e) => onRgbaStringColorChange(e.currentTarget.value)}
                                action={{icon: 'copy', onClick: onCopyRgb}}
                                value={rgbaStringColor}
                            />
                            <Form.Button
                                basic
                                icon="star outline"
                                onClick={() => {
                                    onAddToFavorites(hexColor);
                                    reloadFavorites();
                                }}
                            />
                        </Form>
                    </GridColumn>
                </Grid>
            </Segment>
            <h3>Favorites</h3>
            <Table basic="very" unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Color</Table.HeaderCell>
                        <Table.HeaderCell>HEX</Table.HeaderCell>
                        <Table.HeaderCell>RGB</Table.HeaderCell>
                        <Table.HeaderCell/>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {colors.map((hex, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <Table.Row key={index}>
                            <Table.Cell collapsing textAlign="center">
                                <Segment
                                    style={{
                                        backgroundColor: hex,
                                    }}
                                />
                            </Table.Cell>
                            <Table.Cell>{hex}</Table.Cell>
                            <Table.Cell>{hexToRgb(hex)}</Table.Cell>
                            <Table.Cell textAlign="right">
                                <Button
                                    basic
                                    color="red"
                                    icon="trash"
                                    onClick={() => onRemove(hex)}
                                />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </Tab.Pane>
    );
}

function TabWebSafeColors() {
    return (
        <Tab.Pane>
            <Table basic="very" unstackable textAlign="center">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Color</Table.HeaderCell>
                        <Table.HeaderCell>HEX</Table.HeaderCell>
                        <Table.HeaderCell>RGB</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell/>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {webSafeColors.map((color) => (
                        <Table.Row key={color.hex}>
                            <Table.Cell collapsing textAlign="center">
                                <Segment
                                    style={{
                                        backgroundColor: color.hex,
                                    }}
                                />
                            </Table.Cell>
                            <Table.Cell>{color.hex}</Table.Cell>
                            <Table.Cell>{color.decimal}</Table.Cell>
                            <Table.Cell>{color.name}</Table.Cell>
                            <Table.Cell textAlign="right">
                                <Button
                                    basic
                                    icon="star outline"
                                    onClick={() => onAddToFavorites(color.hex)}
                                />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </Tab.Pane>
    );
}

function TabPaletteColors() {
    const onClickColorPalettes = (c) => {
        utils.copy(c);
    };

    return (
        <Tab.Pane>
            <Header as="h3">Scales</Header>

            <Grid>
                <Grid.Row>
                    <Grid.Column textAlign="center">
                        <Button.Group>
                            <Button
                                onClick={() => onClickColorPalettes('#1b1f23')}
                                style={{
                                    backgroundColor: '#1b1f23',
                                    color: 'white',
                                }}
                            >
                                #1b1f23
                            </Button>
                            <Button
                                onClick={() => onClickColorPalettes('#ffffff')}
                                style={{
                                    backgroundColor: '#ffffff',
                                    border: 'solid 1px #cccccc',
                                }}
                            >
                                #ffffff
                            </Button>
                        </Button.Group>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    {colorScales.map((scale, idx) => (
                        <Grid.Column
                            textAlign="center"
                            // eslint-disable-next-line react/no-array-index-key
                            key={idx}
                            style={{padding: 12}}
                            width="4"
                        >
                            <Header as="h4">{scale.color}</Header>
                            <Button.Group vertical fluid>
                                {scale.scale.map((c, index) => (
                                    <Button
                                        // eslint-disable-next-line react/no-array-index-key
                                        key={index}
                                        onClick={() => onClickColorPalettes(c)}
                                        style={{
                                            justifyContent: 'center',
                                            backgroundColor: c,
                                            color: isDarkColor(c)
                                                ? 'rgba(255,255,255,0.75)'
                                                : 'rgba(0,0,0,0.75)',
                                        }}
                                    >
                                        {c}
                                    </Button>
                                ))}
                            </Button.Group>
                        </Grid.Column>
                    ))}
                </Grid.Row>
            </Grid>
            <Header as="h3">Palette</Header>
            <Grid columns={4}>
                {colorPalettes.map((hex, idx) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <GridColumn key={idx}>
                        <Button.Group vertical fluid>
                            {hex.map((c, index) => (
                                <Button
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}
                                    onClick={() => onClickColorPalettes(c)}
                                    style={{
                                        justifyContent: 'center',
                                        backgroundColor: c,
                                        color: isDarkColor(c)
                                            ? 'rgba(255,255,255,0.75)'
                                            : 'rgba(0,0,0,0.75)',
                                    }}
                                >
                                    {c}
                                </Button>
                            ))}
                        </Button.Group>
                    </GridColumn>
                ))}
            </Grid>
        </Tab.Pane>
    );
}

function TabColorTable() {
    return (
        <Tab.Pane>
            <Table basic="very" unstackable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Color</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>HEX</Table.HeaderCell>
                        <Table.HeaderCell>RGB</Table.HeaderCell>
                        <Table.HeaderCell/>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {colorTable.map((color) => (
                        <Table.Row key={color.name}>
                            <Table.Cell collapsing textAlign="center">
                                <Segment
                                    style={{
                                        backgroundColor: color.hex,
                                    }}
                                />
                            </Table.Cell>
                            <Table.Cell>{color.name}</Table.Cell>
                            <Table.Cell>{color.hex}</Table.Cell>
                            <Table.Cell>{`rgb(${color.rgb})`}</Table.Cell>
                            <Table.Cell textAlign="right">
                                <Button
                                    basic
                                    icon="star outline"
                                    onClick={() => onAddToFavorites(color.hex)}
                                />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </Tab.Pane>
    );
}

const tabColorPicker = () => <TabColorPicker/>;
const tabWebSafeColors = () => <TabWebSafeColors/>;
const tabPaletteColors = () => <TabPaletteColors/>;
const tabColorTable = () => <TabColorTable/>;

const panes = [
    {menuItem: 'Picker', render: tabColorPicker},
    {menuItem: 'Palettes', render: tabPaletteColors},
    {menuItem: 'Colors', render: tabColorTable},
    {menuItem: 'Web Safe', render: tabWebSafeColors},
];

export default function ColorPicker() {
    return <LayoutResolver> <Tab menu={{secondary: true, pointing: true}} panes={panes}/> </LayoutResolver>;
}
