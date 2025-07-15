import { Label, Select } from "@adminjs/design-system";
import { ApiClient, BasePropertyProps, ResourceActionAPIParams } from "adminjs"
import { useEffect, useState } from "react";
import { camelToTitleCase } from "../../../utils/common.js";
import { PartnerType } from "@prisma/client";

const api = new ApiClient()

const SelectShareHolder = (props: BasePropertyProps) => {
    const { onChange, property, record } = props;
    const [options, setOptions] = useState([]);

    const selected = record.params[property.path] || '';

    useEffect(() => {
        const resourceActionParam: ResourceActionAPIParams = {
            resourceId: 'Partner',
            actionName: 'list',
            params: {
                'filters.type': PartnerType.SHAREHOLDER,
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

    const handleChange = (selectedOption: any) => {
        onChange(property.path, selectedOption?.value || '');
    };

    return (
        <div className="!pb-8">
            <Label>* {camelToTitleCase(property.label)}</Label>
            <Select
                options={options}
                value={options.find(opt => opt.value === selected) || null}
                onChange={handleChange}
                isClearable
                required
            />
        </div>
    )
}

export default SelectShareHolder