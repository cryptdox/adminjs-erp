import { Label, Select } from "@adminjs/design-system";
import { ApiClient, BasePropertyProps, ResourceActionAPIParams, useCurrentAdmin } from "adminjs"
import { useEffect, useState } from "react";
import { camelToTitleCase } from "../../../utils/common.js";

const api = new ApiClient()

const SelectTenant = (props: any) => {
    const { onChange, property, record, filter, where } = props;
    const [currentAdmin] = useCurrentAdmin();
    const [options, setOptions] = useState([]);
    const [selectedValue, setSelectedValue] = useState<{ label: string, value: string }>(null);

    useEffect(() => {
        const resourceActionParam: ResourceActionAPIParams = {
            resourceId: 'Tenant',
            actionName: 'list',
            params: {
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
        let selected = options?.find(opt => opt.value === (where == 'filter' ? filter[property.path] : record?.params[property.path]))
        setSelectedValue(selected)
    }, [options])

    return currentAdmin.isSuper && (
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

export default SelectTenant