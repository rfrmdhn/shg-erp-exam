import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { setActivePinia, createPinia } from 'pinia';
import VendorView from './VendorView.vue';
import { useUnitStore } from '@/stores/unit';
import { useVendorStore } from '@/stores/vendor';

const vuetify = createVuetify({ components, directives });

function mountView() {
  return mount(VendorView, {
    global: { plugins: [vuetify] },
  });
}

describe('VendorView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('renders vendor rows from the store', async () => {
    const unit = useUnitStore();
    unit.units = [{ id: 1, name: 'Siloam Lippo Village' }];
    unit.selectedUnitId = 1;

    const vendor = useVendorStore();
    vendor.fetchVendors = vi.fn();
    vendor.vendors = [
      { id: 1, vendorId: 'Vendor001', name: 'Vendor 001', address: 'Tangerang', unitId: 1 },
    ];
    vendor.total = 1;

    const wrapper = mountView();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Vendor001');
    expect(wrapper.text()).toContain('Tangerang');
  });

  it('opens the New Vendor dialog when the button is clicked', async () => {
    const unit = useUnitStore();
    unit.selectedUnitId = 1;
    const vendor = useVendorStore();
    vendor.fetchVendors = vi.fn();

    const wrapper = mountView();
    await wrapper.find('[data-test="new-vendor-btn"]').trigger('click');
    await wrapper.vm.$nextTick();

    // dialog content teleports to body — all three required fields must be present
    expect(document.body.querySelector('[data-test="field-vendor-id"]')).toBeTruthy();
    expect(document.body.querySelector('[data-test="field-name"]')).toBeTruthy();
  });

  it('refetches vendors when the selected unit changes', async () => {
    const unit = useUnitStore();
    unit.selectedUnitId = 1;
    const vendor = useVendorStore();
    const fetchSpy = vi.fn();
    vendor.fetchVendors = fetchSpy;

    mountView();
    fetchSpy.mockClear();

    unit.selectedUnitId = 2;
    await new Promise((r) => setTimeout(r, 0));

    expect(fetchSpy).toHaveBeenCalledWith(2, 1, vendor.limit);
  });
});
