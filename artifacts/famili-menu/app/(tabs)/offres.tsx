import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppPage, PageHeading, SmallTag } from '@/components/FamiliMenuUI';
import { useColors } from '@/hooks/useColors';

const OFFERS = [
  { name: 'Premier mois gratuit', price: '0 FCFA', detail: 'Découvrez FamiliMenu pendant votre premier mois.', emphasis: false },
  { name: 'Mensuel', price: '500 FCFA', detail: 'Par mois après la période d’essai gratuite.', emphasis: true },
  { name: 'Annuel', price: '5 000 FCFA', detail: 'Par an après la période d’essai gratuite.', emphasis: false },
];

export default function OffresScreen() {
  const colors = useColors();
  return (
    <AppPage>
      <PageHeading
        eyebrow="FamiliMenu"
        title="Des repas sans stress"
        subtitle="Choisissez l’offre adaptée à votre famille. Les tarifs sont affichés en francs CFA."
      />

      <View style={[styles.trialCard, { backgroundColor: colors.primary }]}>
        <View style={styles.trialIcon}>
          <Feather name="gift" size={20} color="#FFFFFF" />
        </View>
        <Text style={styles.trialTitle}>Votre premier mois est offert.</Text>
        <Text style={styles.trialCopy}>Après la période d’essai, un abonnement payant sera nécessaire pour continuer à utiliser le service.</Text>
      </View>

      <View style={styles.offerList}>
        {OFFERS.map((offer) => (
          <View
            key={offer.name}
            style={[
              styles.offerCard,
              { backgroundColor: colors.card, borderColor: offer.emphasis ? colors.primary : colors.border },
              offer.emphasis && styles.featuredOffer,
            ]}
          >
            <View style={styles.offerTop}>
              <Text style={[styles.offerName, { color: colors.foreground }]}>{offer.name}</Text>
              {offer.emphasis ? <SmallTag>POPULAIRE</SmallTag> : null}
            </View>
            <Text style={[styles.price, { color: offer.emphasis ? colors.primary : colors.foreground }]}>{offer.price}</Text>
            <Text style={[styles.offerDetail, { color: colors.mutedForeground }]}>{offer.detail}</Text>
            {offer.name === 'Mensuel' ? (
              <Text style={[styles.billingUnit, { color: colors.mutedForeground }]}>soit 500 FCFA / mois</Text>
            ) : offer.name === 'Annuel' ? (
              <Text style={[styles.billingUnit, { color: colors.mutedForeground }]}>soit environ 417 FCFA / mois</Text>
            ) : null}
          </View>
        ))}
      </View>

      <View style={[styles.notice, { backgroundColor: '#FBEAD9' }]}>
        <Feather name="lock" size={16} color={colors.secondaryForeground} />
        <Text style={[styles.noticeText, { color: colors.secondaryForeground }]}>
          Aucun paiement n’est effectué dans cette version. La souscription et le paiement Mobile Money seront ajoutés ultérieurement.
        </Text>
      </View>
    </AppPage>
  );
}

const styles = StyleSheet.create({
  trialCard: { borderRadius: 21, padding: 19, gap: 10 },
  trialIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  trialTitle: { color: '#FFFFFF', fontSize: 21, lineHeight: 27, fontFamily: 'Inter_700Bold' },
  trialCopy: { color: '#E5EEE8', fontSize: 13, lineHeight: 20, fontFamily: 'Inter_400Regular' },
  offerList: { gap: 11 },
  offerCard: { borderWidth: 1, borderRadius: 18, padding: 17, gap: 8 },
  featuredOffer: { borderWidth: 2 },
  offerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  offerName: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  price: { fontSize: 26, fontFamily: 'Inter_700Bold' },
  offerDetail: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  billingUnit: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  notice: { flexDirection: 'row', gap: 9, padding: 14, borderRadius: 14, alignItems: 'flex-start' },
  noticeText: { flex: 1, fontSize: 12, lineHeight: 18, fontFamily: 'Inter_500Medium' },
});
