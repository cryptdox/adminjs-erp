import { Label, Select } from "@adminjs/design-system";
import { ApiClient, BasePropertyProps, ResourceActionAPIParams } from "adminjs"
import { useEffect, useState } from "react";
import { camelToTitleCase } from "../../../utils/common.js";
import { PartnerType } from "@prisma/client";

const api = new ApiClient()

const SelectInvestmentProfile = (props: BasePropertyProps) => {
    const { onChange, property, record, filter, where } = props;
    const [options, setOptions] = useState([]);
    const [selectedValue, setSelectedValue] = useState<{ label: string, value: string }>(null);

    useEffect(() => {
        const resourceActionParam: ResourceActionAPIParams = {
            resourceId: 'InvestmentProfile',
            actionName: 'list',
            params: {
                'filters.acceptingInvest': true,
                page: 1,
                perPage: 500
            }
        }

        api.resourceAction(resourceActionParam)
            .then(response => {
                console.log("response", response)
                const opts = response.data.records.map((r: any) => ({
                    value: r.id,
                    label: r.params.name,
                }));
                setOptions(opts);
            });
    }, []);

    useEffect(() => {
        let selected = options?.find(opt => opt.value === (where == 'filter' ? filter[property?.path] : record?.params[property?.path]))
        setSelectedValue(selected)
    }, [options])

    return (
        <div className="!pb-8">
            <Label>{where !== 'filter' && '*'} {camelToTitleCase(property.label)}</Label>
            <Select
                options={options}
                value={selectedValue}
                onChange={(selectedValue) => {
                    onChange(property.path, selectedValue?.value || '');
                    setSelectedValue(selectedValue)
                }}
                isClearable
                required={where !== 'filter'}
            />
        </div>
    )
}

export default SelectInvestmentProfile