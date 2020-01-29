import React, { useState } from 'react';
import { getPercent } from '../../../helpers/Helpers';
import {
    Progress,
    ProgressBar,
    NodeTitle,
    StatusLine,
    MainInfo,
} from '../Channels.style';
import ReactTooltip from 'react-tooltip';
import {
    SubCard,
    Separation,
    Sub4Title,
    RightAlign,
    ResponsiveLine,
    ResponsiveSingle,
    ResponsiveCol,
} from '../../../components/generic/Styled';
import { useSettings } from '../../../context/SettingsContext';
import {
    getStatusDot,
    getTooltipType,
    getFormatDate,
    getDateDif,
    renderLine,
} from '../../../components/generic/Helpers';
import {
    getTransactionLink,
    getNodeLink,
} from '../../../components/generic/Helpers';
import Modal from '../../../components/modal/ReactModal';
import { CloseChannel } from '../../../components/closeChannel/CloseChannel';
import styled from 'styled-components';
import { AdminSwitch } from '../../../components/adminSwitch/AdminSwitch';
import { DownArrow, UpArrow, EyeOff } from '../../../components/generic/Icons';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { Price } from 'components/price/Price';

const IconPadding = styled.div`
    margin-left: 16px;
    margin-right: 8px;
`;

const getSymbol = (status: boolean) => {
    return status ? <UpArrow /> : <DownArrow />;
};

const getPrivate = (status: boolean) => {
    return status && <EyeOff />;
};

interface ChannelCardProps {
    channelInfo: any;
    index: number;
    setIndexOpen: (index: number) => void;
    indexOpen: number;
}

export const ChannelCard = ({
    channelInfo,
    index,
    setIndexOpen,
    indexOpen,
}: ChannelCardProps) => {
    const [modalOpen, setModalOpen] = useState(false);

    const { theme } = useSettings();

    const tooltipType = getTooltipType(theme);

    const {
        capacity,
        commit_transaction_fee,
        commit_transaction_weight,
        id,
        is_active,
        is_closing,
        is_opening,
        is_partner_initiated,
        is_private,
        is_static_remote_key,
        local_balance,
        local_reserve,
        partner_public_key,
        received,
        remote_balance,
        remote_reserve,
        sent,
        time_offline,
        time_online,
        transaction_id,
        transaction_vout,
        unsettled_balance,
        partner_node_info,
    } = channelInfo;

    const {
        alias,
        capacity: node_capacity,
        channel_count,
        color: nodeColor,
        updated_at,
    } = partner_node_info;

    const formatBalance = <Price amount={capacity} />;
    const formatLocal = <Price amount={local_balance} />;
    const formatRemote = <Price amount={remote_balance} />;
    const formatReceived = <Price amount={received} />;
    const formatSent = <Price amount={sent} />;

    const commitFee = <Price amount={commit_transaction_fee} />;
    const commitWeight = <Price amount={commit_transaction_weight} />;
    const localReserve = <Price amount={local_reserve} />;
    const remoteReserve = <Price amount={remote_reserve} />;
    const nodeCapacity = <Price amount={node_capacity} />;

    const handleClick = () => {
        if (indexOpen === index) {
            setIndexOpen(0);
        } else {
            setIndexOpen(index);
        }
    };

    const renderDetails = () => {
        return (
            <>
                <Separation />
                {renderLine(
                    'Balancedness:',
                    getPercent(local_balance, remote_balance) / 100,
                )}
                {renderLine('Local Balance:', formatLocal)}
                {renderLine('Remote Balance:', formatRemote)}
                {renderLine('Received:', formatReceived)}
                {renderLine('Sent:', formatSent)}
                {renderLine(
                    'Node Public Key:',
                    getNodeLink(partner_public_key),
                )}
                {renderLine(
                    'Transaction Id:',
                    getTransactionLink(transaction_id),
                )}
                {renderLine('Channel Id:', id)}
                {renderLine('Commit Fee:', commitFee)}
                {renderLine('Commit Weight:', commitWeight)}
                {renderLine('Is Static Remote Key:', is_static_remote_key)}
                {renderLine('Local Reserve:', localReserve)}
                {renderLine('Remote Reserve:', remoteReserve)}
                {renderLine('Time Offline:', time_offline)}
                {renderLine('Time Online:', time_online)}
                {renderLine('Transaction Vout:', transaction_vout)}
                {renderLine('Unsettled Balance:', unsettled_balance)}
                <Sub4Title>Partner Node Info</Sub4Title>
                {renderLine('Node Capacity:', nodeCapacity)}
                {renderLine('Channel Count:', channel_count)}
                {renderLine(
                    'Last Update:',
                    `${getDateDif(updated_at)} ago (${getFormatDate(
                        updated_at,
                    )})`,
                )}
                <AdminSwitch>
                    <Separation />
                    <RightAlign>
                        <ColorButton
                            withBorder={true}
                            arrow={true}
                            onClick={() => setModalOpen(true)}
                        >
                            Close Channel
                        </ColorButton>
                    </RightAlign>
                </AdminSwitch>
            </>
        );
    };

    return (
        <SubCard color={nodeColor} key={index}>
            <MainInfo onClick={() => handleClick()}>
                <StatusLine>
                    {getStatusDot(is_active, 'active')}
                    {getStatusDot(is_opening, 'opening')}
                    {getStatusDot(is_closing, 'closing')}
                </StatusLine>
                <ResponsiveLine>
                    <NodeTitle>{alias ? alias : 'Unknown'}</NodeTitle>
                    <ResponsiveSingle>
                        {formatBalance}
                        <IconPadding>
                            {getPrivate(is_private)}
                            {getSymbol(is_partner_initiated)}
                        </IconPadding>
                        <ResponsiveCol>
                            <Progress
                                data-tip
                                data-for={`node_balance_tip_${index}`}
                            >
                                <ProgressBar
                                    percent={getPercent(
                                        local_balance,
                                        remote_balance,
                                    )}
                                />
                            </Progress>
                            <Progress
                                data-tip
                                data-for={`node_activity_tip_${index}`}
                            >
                                <ProgressBar
                                    order={2}
                                    percent={getPercent(received, sent)}
                                />
                            </Progress>
                        </ResponsiveCol>
                    </ResponsiveSingle>
                </ResponsiveLine>
            </MainInfo>
            {index === indexOpen && renderDetails()}
            <ReactTooltip
                id={`node_balance_tip_${index}`}
                effect={'solid'}
                place={'bottom'}
                type={tooltipType}
            >
                <div>{`Local Balance: ${formatLocal}`}</div>
                <div>{`Remote Balance: ${formatRemote}`}</div>
            </ReactTooltip>
            <ReactTooltip
                id={`node_activity_tip_${index}`}
                effect={'solid'}
                place={'bottom'}
                type={tooltipType}
            >
                <div>{`Received: ${formatReceived}`}</div>
                <div>{`Sent: ${formatSent}`}</div>
            </ReactTooltip>
            <Modal isOpen={modalOpen} setIsOpen={setModalOpen}>
                <CloseChannel
                    setModalOpen={setModalOpen}
                    channelId={id}
                    channelName={alias}
                />
            </Modal>
        </SubCard>
    );
};
